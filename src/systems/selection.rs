use bevy::prelude::*;
use crate::{components::*, resources::*, EditorCamera};

pub fn object_selection(
    mut commands: Commands,
    mut editor_state: ResMut<EditorState>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    windows: Query<&Window>,
    camera_query: Query<(&Camera, &GlobalTransform), With<EditorCamera>>,
    selectable_query: Query<(Entity, &GlobalTransform), Or<(With<MovingLight>, With<Avatar>, With<ImportedGltf>)>>,
    mut selected_query: Query<Entity, With<Selected>>,
) {
    if !matches!(editor_state.tool_mode, ToolMode::Select) {
        return;
    }
    
    if mouse_button_input.just_pressed(MouseButton::Left) {
        let window = windows.single();
        if let Some(cursor_position) = window.cursor_position() {
            if let Ok((camera, camera_transform)) = camera_query.get_single() {
                if let Ok(ray) = camera.viewport_to_world(camera_transform, cursor_position) {
                    let mut closest_entity = None;
                    let mut closest_distance = f32::INFINITY;
                    
                    // Check all selectable entities
                    for (entity, global_transform) in selectable_query.iter() {
                        let entity_pos = global_transform.translation();
                        let to_entity = entity_pos - ray.origin;
                        let projected = ray.direction.dot(to_entity);
                        
                        if projected > 0.0 {
                            let closest_point = ray.origin + ray.direction * projected;
                            let distance_to_ray = closest_point.distance(entity_pos);
                            let distance_from_camera = entity_pos.distance(ray.origin);
                            
                            // Select if within 1 unit of ray and closer than previous selection
                            if distance_to_ray < 1.0 && distance_from_camera < closest_distance {
                                closest_distance = distance_from_camera;
                                closest_entity = Some(entity);
                            }
                        }
                    }
                    
                    // Clear previous selections
                    for entity in selected_query.iter() {
                        commands.entity(entity).remove::<Selected>();
                    }
                    
                    // Select new entity
                    if let Some(entity) = closest_entity {
                        commands.entity(entity).insert(Selected);
                        editor_state.selected_entity = Some(entity);
                        info!("Selected entity: {:?}", entity);
                    } else {
                        editor_state.selected_entity = None;
                        info!("Deselected all entities");
                    }
                }
            }
        }
    }
}