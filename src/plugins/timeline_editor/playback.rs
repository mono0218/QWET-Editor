use bevy::prelude::*;
use crate::components::*;
use super::types::*;

pub fn update_timeline_playback(
    mut timeline: ResMut<TimelineState>,
    time: Res<Time>,
) {
    if timeline.is_playing {
        timeline.current_time += time.delta_secs();
        
        // Loop back to start if we exceed total time
        if timeline.current_time > timeline.total_time {
            timeline.current_time = 0.0;
        }
    }
}

pub fn update_light_animation(
    timeline: Res<TimelineState>,
    light_groups: Res<LightGroups>,
    mut light_query: Query<(Entity, &mut MovingLight, &mut Transform, &mut SpotLight)>,
    _time: Res<Time>,
) {
    // Apply animation to lights based on current time
    for (_group_name, group) in &light_groups.groups {
        if group.keyframes.len() < 2 {
            continue;
        }
        
        let current_time = timeline.current_time;
        
        // Apply to all lights in the group
        for &light_entity in &group.lights {
            if let Ok((_entity, mut moving_light, _transform, mut spot_light)) = light_query.get_mut(light_entity) {
                // Interpolate each track separately
                if let Some(pan) = interpolate_track(&group.keyframes, current_time, |kf| kf.pan) {
                    moving_light.pan = pan.to_radians();
                }
                
                if let Some(tilt) = interpolate_track(&group.keyframes, current_time, |kf| kf.tilt) {
                    moving_light.tilt = tilt.to_radians();
                }
                
                if let Some(intensity) = interpolate_track(&group.keyframes, current_time, |kf| kf.intensity) {
                    moving_light.intensity = intensity;
                    spot_light.intensity = intensity * 1000.0;
                }
                
                // Handle RGB color interpolation
                let red = interpolate_track(&group.keyframes, current_time, |kf| kf.red).unwrap_or(moving_light.color.to_srgba().red);
                let green = interpolate_track(&group.keyframes, current_time, |kf| kf.green).unwrap_or(moving_light.color.to_srgba().green);
                let blue = interpolate_track(&group.keyframes, current_time, |kf| kf.blue).unwrap_or(moving_light.color.to_srgba().blue);
                
                let new_color = Color::srgba(red, green, blue, 1.0);
                moving_light.color = new_color;
                spot_light.color = new_color;
            }
        }
    }
}

// Helper function to interpolate a single track
pub fn interpolate_track(
    keyframes: &[LightKeyframe], 
    current_time: f32, 
    get_value: impl Fn(&LightKeyframe) -> Option<f32>
) -> Option<f32> {
    let mut prev_kf = None;
    let mut next_kf = None;
    
    for keyframe in keyframes {
        if keyframe.time <= current_time && get_value(keyframe).is_some() {
            prev_kf = Some((keyframe, get_value(keyframe).unwrap()));
        }
        if keyframe.time > current_time && get_value(keyframe).is_some() && next_kf.is_none() {
            next_kf = Some((keyframe, get_value(keyframe).unwrap()));
            break;
        }
    }
    
    match (prev_kf, next_kf) {
        (Some((prev, prev_val)), Some((next, next_val))) => {
            let t = (current_time - prev.time) / (next.time - prev.time);
            Some(prev_val + t * (next_val - prev_val))
        }
        (Some((_, val)), None) => Some(val), // Use last keyframe value
        (None, Some((_, val))) => Some(val), // Use first keyframe value
        (None, None) => None, // No keyframes for this track
    }
}

pub fn sync_lights_to_groups(
    mut light_groups: ResMut<LightGroups>,
    light_query: Query<(Entity, &crate::components::MovingLight), Changed<crate::components::MovingLight>>,
    all_lights_query: Query<(Entity, &crate::components::MovingLight)>,
) {
    // First, clear all lights from groups and rebuild from current light states
    for group in light_groups.groups.values_mut() {
        group.lights.clear();
    }
    
    // Add all lights to their assigned groups
    for (entity, moving_light) in all_lights_query.iter() {
        if let Some(group_id) = &moving_light.group_id {
            if let Some(group) = light_groups.groups.get_mut(group_id) {
                if !group.lights.contains(&entity) {
                    group.lights.push(entity);
                }
            }
        }
    }
    
    // Log changes when a light's group assignment changes
    for (entity, moving_light) in light_query.iter() {
        if let Some(group_id) = &moving_light.group_id {
            info!("Light {:?} assigned to group {}", entity, group_id);
        } else {
            info!("Light {:?} removed from all groups", entity);
        }
    }
}
