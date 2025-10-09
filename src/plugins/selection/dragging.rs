use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*, EditorCamera};

pub fn object_dragging(
    mut editor_state: ResMut<EditorState>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    windows: Query<&Window>,
    camera_query: Query<(&Camera, &GlobalTransform), With<EditorCamera>>,
    mut selected_query: Query<&mut Transform, With<Selected>>,
    mut egui_contexts: bevy_egui::EguiContexts,
) {
    if !matches!(editor_state.tool_mode, ToolMode::Select) {
        return;
    }

    if editor_state.selected_entity.is_none() {
        // If no entity is selected, stop any dragging
        if editor_state.is_dragging {
            editor_state.is_dragging = false;
            editor_state.drag_start_pos = None;
            editor_state.drag_offset = Vec3::ZERO;
        }
        return;
    }

    let ctx = egui_contexts.ctx_mut();
    
    // Don't drag if UI is being interacted with
    if ctx.is_pointer_over_area() || ctx.wants_pointer_input() {
        return;
    }

    // Don't drag objects if camera look controls are active
    let camera_look_active = mouse_button_input.pressed(MouseButton::Right) 
        || mouse_button_input.pressed(MouseButton::Middle)
        || (mouse_button_input.pressed(MouseButton::Left) && keyboard_input.pressed(KeyCode::AltLeft));
    
    if camera_look_active {
        return;
    }

    let Ok(window) = windows.get_single() else { return };
    let Some(cursor_position) = window.cursor_position() else { return };

    if mouse_button_input.just_pressed(MouseButton::Left) {
        // Start dragging - always get fresh position of currently selected object
        editor_state.is_dragging = true;
        editor_state.drag_start_pos = Some(cursor_position);
        
        // ALWAYS get the current object's position at drag start
        if let Ok(selected_transform) = selected_query.get_single() {
            editor_state.drag_offset = selected_transform.translation;
        } else {
            // No object selected, cancel drag
            editor_state.is_dragging = false;
            editor_state.drag_start_pos = None;
            editor_state.drag_offset = Vec3::ZERO;
            return;
        }
    } else if mouse_button_input.pressed(MouseButton::Left) && editor_state.is_dragging {
        // Continue dragging on a horizontal plane (XZ plane at original Y height)
        if let Ok((camera, camera_transform)) = camera_query.get_single() {
            if let Ok(mut selected_transform) = selected_query.get_single_mut() {
                if let Some(drag_start_pos) = editor_state.drag_start_pos {
                    if let Ok(start_ray) = camera.viewport_to_world(camera_transform, drag_start_pos) {
                        if let Ok(current_ray) = camera.viewport_to_world(camera_transform, cursor_position) {
                            // Use the original Y position to maintain height
                            let original_y = editor_state.drag_offset.y;
                            
                            // Calculate intersection with XZ plane at original Y height
                            let plane_y = original_y;
                            
                            // Start position intersection with plane
                            let start_world_pos = if start_ray.direction.y.abs() > 0.001 {
                                let t = (plane_y - start_ray.origin.y) / start_ray.direction.y;
                                start_ray.origin + start_ray.direction * t
                            } else {
                                Vec3::new(start_ray.origin.x, plane_y, start_ray.origin.z)
                            };
                            
                            // Current position intersection with plane
                            let current_world_pos = if current_ray.direction.y.abs() > 0.001 {
                                let t = (plane_y - current_ray.origin.y) / current_ray.direction.y;
                                current_ray.origin + current_ray.direction * t
                            } else {
                                Vec3::new(current_ray.origin.x, plane_y, current_ray.origin.z)
                            };
                            
                            // Calculate movement delta
                            let movement_delta = current_world_pos - start_world_pos;
                            
                            // Apply movement to original position
                            selected_transform.translation = editor_state.drag_offset + movement_delta;
                        }
                    }
                }
            }
        }
    } else if mouse_button_input.just_released(MouseButton::Left) {
        // Stop dragging
        editor_state.is_dragging = false;
        editor_state.drag_start_pos = None;
        editor_state.drag_offset = Vec3::ZERO;
    }
}

