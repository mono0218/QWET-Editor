use bevy::prelude::*;
use crate::components::*;
use super::types::*;
use super::events::*;

pub fn handle_group_creation(
    mut create_group_events: EventReader<CreateGroupEvent>,
    mut light_groups: ResMut<LightGroups>,
) {
    for event in create_group_events.read() {
        let group = LightGroup {
            lights: Vec::new(),
            color: Color::srgb(
                rand::random::<f32>(),
                rand::random::<f32>(),
                rand::random::<f32>(),
            ),
            keyframes: Vec::new(),
        };
        
        light_groups.groups.insert(event.name.clone(), group);
        info!("Created light group: {}", event.name);
    }
}

pub fn handle_light_grouping(
    mut add_light_events: EventReader<AddLightToGroupEvent>,
    mut light_groups: ResMut<LightGroups>,
) {
    for event in add_light_events.read() {
        if let Some(group) = light_groups.groups.get_mut(&event.group_name) {
            if !group.lights.contains(&event.light_entity) {
                group.lights.push(event.light_entity);
                info!("Added light {:?} to group {}", event.light_entity, event.group_name);
            }
        }
    }
}

pub fn handle_keyframe_creation(
    mut create_keyframe_events: EventReader<CreateKeyframeEvent>,
    mut light_groups: ResMut<LightGroups>,
) {
    for event in create_keyframe_events.read() {
        if let Some(group) = light_groups.groups.get_mut(&event.group_name) {
            // Find existing keyframe at this time or create new one
            let mut found_keyframe = false;
            for keyframe in &mut group.keyframes {
                if (keyframe.time - event.time).abs() < 0.1 {
                    // Update existing keyframe
                    match event.track {
                        TimelineTrack::Pan => keyframe.pan = Some(event.value),
                        TimelineTrack::Tilt => keyframe.tilt = Some(event.value),
                        TimelineTrack::RGB => {
                            if let Some((r, g, b)) = event.rgb_values {
                                keyframe.red = Some(r);
                                keyframe.green = Some(g);
                                keyframe.blue = Some(b);
                            }
                        },
                        TimelineTrack::Intensity => keyframe.intensity = Some(event.value),
                    }
                    found_keyframe = true;
                    break;
                }
            }
            
            // Create new keyframe if none found at this time
            if !found_keyframe {
                let mut new_keyframe = LightKeyframe {
                    time: event.time,
                    pan: None,
                    tilt: None,
                    red: None,
                    green: None,
                    blue: None,
                    intensity: None,
                };
                
                // Set the specific track value
                match event.track {
                    TimelineTrack::Pan => new_keyframe.pan = Some(event.value),
                    TimelineTrack::Tilt => new_keyframe.tilt = Some(event.value),
                    TimelineTrack::RGB => {
                        if let Some((r, g, b)) = event.rgb_values {
                            new_keyframe.red = Some(r);
                            new_keyframe.green = Some(g);
                            new_keyframe.blue = Some(b);
                        }
                    },
                    TimelineTrack::Intensity => new_keyframe.intensity = Some(event.value),
                }
                
                group.keyframes.push(new_keyframe);
                group.keyframes.sort_by(|a, b| a.time.partial_cmp(&b.time).unwrap());
            }
            
            info!("Created {:?} keyframe at time {:.2}s for group {} with value {:.2}", 
                  event.track, event.time, event.group_name, event.value);
        }
    }
}

pub fn handle_keyframe_deletion(
    mut delete_keyframe_events: EventReader<DeleteKeyframeEvent>,
    mut light_groups: ResMut<LightGroups>,
) {
    for event in delete_keyframe_events.read() {
        if let Some(group) = light_groups.groups.get_mut(&event.group_name) {
            if event.keyframe_index < group.keyframes.len() {
                let removed_keyframe = group.keyframes.remove(event.keyframe_index);
                info!("Deleted keyframe at time {:.2}s from group {}", 
                      removed_keyframe.time, event.group_name);
            }
        }
    }
}

pub fn handle_keyframe_editing(
    mut edit_keyframe_events: EventReader<EditKeyframeEvent>,
    mut timeline: ResMut<TimelineState>,
) {
    for event in edit_keyframe_events.read() {
        timeline.editing_keyframe = Some((event.group_name.clone(), event.keyframe_index));
        info!("Editing keyframe {} in group {}", event.keyframe_index, event.group_name);
    }
}
