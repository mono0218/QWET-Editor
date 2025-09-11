use bevy::prelude::*;
use bevy::math::{EulerRot, Quat};
use bevy::gizmos::gizmos::Gizmos;
use crate::{components::*, resources::*, plugins::editor::EditorCamera};

pub struct SelectionPlugin;

impl Plugin for SelectionPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_systems(Update, (
                object_selection,
                object_dragging.after(object_selection),
                show_selected_properties,
                draw_selection_gizmos,
            ));
    }
}

fn object_selection(
    mut commands: Commands,
    mut editor_state: ResMut<EditorState>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    windows: Query<&Window>,
    camera_query: Query<(&Camera, &GlobalTransform), With<EditorCamera>>,
    selectable_query: Query<(Entity, &GlobalTransform), Without<Selected>>,
    imported_gltf_query: Query<Entity, With<ImportedGltf>>,
    moving_light_query: Query<Entity, With<crate::components::MovingLight>>,
    parent_query: Query<&Parent>,
    selected_query: Query<Entity, With<Selected>>,
    entity_exists_query: Query<Entity>,
    mut egui_contexts: bevy_egui::EguiContexts,
) {
    if !matches!(editor_state.tool_mode, ToolMode::Select) {
        return;
    }

    // Don't process selection if we're currently dragging
    if editor_state.is_dragging {
        return;
    }
    
    if mouse_button_input.just_pressed(MouseButton::Left) {
        // Check if UI is being interacted with
        let ctx = egui_contexts.ctx_mut();
        if ctx.is_pointer_over_area() || ctx.wants_pointer_input() {
            // UI is active, don't process 3D selection
            return;
        }

        // Don't select objects if camera look controls are active
        let camera_look_active = mouse_button_input.pressed(MouseButton::Right) 
            || mouse_button_input.pressed(MouseButton::Middle)
            || (mouse_button_input.pressed(MouseButton::Left) && keyboard_input.pressed(KeyCode::AltLeft));
        
        if camera_look_active {
            return;
        }
        
        let Ok(window) = windows.get_single() else { return };
        if let Some(cursor_position) = window.cursor_position() {
            if let Ok((camera, camera_transform)) = camera_query.get_single() {
                if let Ok(ray) = camera.viewport_to_world(camera_transform, cursor_position) {
                    let mut closest_entity = None;
                    let mut closest_distance = f32::INFINITY;
                    
                    let all_selectable: Vec<_> = selectable_query.iter().collect();
                    info!("Checking {} selectable entities", all_selectable.len());
                    
                    // Helper function to check if entity is child of MovingLight
                    let is_moving_light_child = |entity: Entity| -> bool {
                        let mut current_entity = entity;
                        for _ in 0..10 { // Prevent infinite loop
                            if let Ok(parent) = parent_query.get(current_entity) {
                                let parent_entity = parent.get();
                                if moving_light_query.get(parent_entity).is_ok() {
                                    return true;
                                }
                                current_entity = parent_entity;
                            } else {
                                break;
                            }
                        }
                        false
                    };
                    
                    // First priority: MovingLight entities (but not their children)
                    for moving_light_entity in moving_light_query.iter() {
                        if let Ok((_, global_transform)) = selectable_query.get(moving_light_entity) {
                            let entity_pos = global_transform.translation();
                            let to_entity = entity_pos - ray.origin;
                            let projected = ray.direction.dot(to_entity);
                            
                            if projected > 0.0 {
                                let closest_point = ray.origin + ray.direction * projected;
                                let distance_to_ray = closest_point.distance(entity_pos);
                                let distance_from_camera = entity_pos.distance(ray.origin);
                                
                                // MovingLights have highest priority with large selection radius
                                if distance_to_ray < 15.0 && distance_from_camera < closest_distance {
                                    closest_distance = distance_from_camera;
                                    closest_entity = Some(moving_light_entity);
                                    info!("Found MovingLight selection: Entity {:?}, distance: {:.2}", moving_light_entity, distance_from_camera);
                                }
                            }
                        }
                    }
                    
                    // Second priority: try to select imported GLTF models if no MovingLight found
                    if closest_entity.is_none() {
                        for imported_entity in imported_gltf_query.iter() {
                            if let Ok((_, global_transform)) = selectable_query.get(imported_entity) {
                                let entity_pos = global_transform.translation();
                                let to_entity = entity_pos - ray.origin;
                                let projected = ray.direction.dot(to_entity);
                                
                                if projected > 0.0 {
                                    let closest_point = ray.origin + ray.direction * projected;
                                    let distance_to_ray = closest_point.distance(entity_pos);
                                    let distance_from_camera = entity_pos.distance(ray.origin);
                                    
                                    // Prioritize imported models with larger selection radius
                                    if distance_to_ray < 10.0 && distance_from_camera < closest_distance {
                                        closest_distance = distance_from_camera;
                                        closest_entity = Some(imported_entity);
                                        info!("Found ImportedGltf selection: Entity {:?}, distance: {:.2}", imported_entity, distance_from_camera);
                                    }
                                }
                            }
                        }
                    }
                    
                    // If no ImportedGltf found, check other entities (but exclude MovingLight children)
                    if closest_entity.is_none() {
                        for (entity, global_transform) in all_selectable {
                            // Skip MovingLight child entities
                            if is_moving_light_child(entity) {
                                continue;
                            }
                            
                            let entity_pos = global_transform.translation();
                            let to_entity = entity_pos - ray.origin;
                            let projected = ray.direction.dot(to_entity);
                            
                            if projected > 0.0 {
                                let closest_point = ray.origin + ray.direction * projected;
                                let distance_to_ray = closest_point.distance(entity_pos);
                                let distance_from_camera = entity_pos.distance(ray.origin);
                                
                                // General selection with moderate radius
                                if distance_to_ray < 5.0 && distance_from_camera < closest_distance {
                                    closest_distance = distance_from_camera;
                                    closest_entity = Some(entity);
                                    info!("Found general selection: Entity {:?}, distance: {:.2}", entity, distance_from_camera);
                                }
                            }
                        }
                    }
                    
                    // Clear previous selections
                    for entity in selected_query.iter() {
                        if entity_exists_query.get(entity).is_ok() {
                            commands.entity(entity).remove::<Selected>();
                        }
                    }
                    
                    // Select new entity
                    if let Some(entity) = closest_entity {
                        // Check if entity still exists before trying to select it
                        if entity_exists_query.get(entity).is_ok() {
                            commands.entity(entity).insert(Selected);
                            editor_state.selected_entity = Some(entity);
                            
                            // Reset dragging state when selecting new entity
                            editor_state.is_dragging = false;
                            editor_state.drag_start_pos = None;
                            editor_state.drag_offset = Vec3::ZERO;
                            
                            info!("Selected entity: {:?}", entity);
                        } else {
                            warn!("Tried to select non-existent entity: {:?}", entity);
                            editor_state.selected_entity = None;
                            
                            // Reset dragging state when deselecting
                            editor_state.is_dragging = false;
                            editor_state.drag_start_pos = None;
                            editor_state.drag_offset = Vec3::ZERO;
                        }
                    } else {
                        editor_state.selected_entity = None;
                        
                        // Reset dragging state when deselecting all
                        editor_state.is_dragging = false;
                        editor_state.drag_start_pos = None;
                        editor_state.drag_offset = Vec3::ZERO;
                        
                        info!("Deselected all entities");
                    }
                }
            }
        }
    }
}


use bevy_egui::egui;

fn show_selected_properties(
    mut contexts: bevy_egui::EguiContexts,
    editor_state: Res<EditorState>,
    mut selected_query: Query<(Entity, Option<&ImportedGltf>, Option<&MovingLight>, &mut Transform), With<Selected>>,
) {
    let ctx = contexts.ctx_mut();
    
    // Always show the right panel
    egui::SidePanel::right("properties_panel").default_width(300.0).show(ctx, |ui| {
        ui.heading("Properties");
        
        if let Some(selected_entity) = editor_state.selected_entity {
            if let Ok((entity, imported_gltf, moving_light, mut transform)) = selected_query.get_mut(selected_entity) {
                ui.heading("Selected Object");
                ui.label(format!("Entity: {:?}", entity));
                
                if let Some(imported_gltf) = imported_gltf {
                    ui.label(format!("Imported GLTF: {}", imported_gltf.path));
                }
                
                ui.separator();
                
                // Position controls
                ui.label("Position:");
                ui.horizontal(|ui| {
                    ui.label("X:");
                    ui.add(egui::DragValue::new(&mut transform.translation.x).speed(0.1));
                    ui.label("Y:");
                    ui.add(egui::DragValue::new(&mut transform.translation.y).speed(0.1));
                    ui.label("Z:");
                    ui.add(egui::DragValue::new(&mut transform.translation.z).speed(0.1));
                });
                
                if let Some(moving_light) = moving_light {
                    ui.separator();
                    ui.heading("MovingLight Properties");
                    ui.label(format!("Name: {}", moving_light.name));
                    ui.label(format!("Type: {:?}", moving_light.light_type));
                    ui.label(format!("Intensity: {:.2}", moving_light.intensity));
                    ui.label(format!("Pan: {:.1}°", moving_light.pan.to_degrees()));
                    ui.label(format!("Tilt: {:.1}°", moving_light.tilt.to_degrees()));
                    ui.label(format!("Beam Angle: {:.1}°", moving_light.beam_angle));
                    
                    let group_name = moving_light.group_id.as_ref()
                        .map(|id| id.as_str())
                        .unwrap_or("None");
                    ui.label(format!("Light Group: {}", group_name));
                }
            } else {
                ui.label("Selected entity not found or missing components.");
            }
        } else {
            ui.label("No object selected");
            ui.label("Click on an object in the 3D view to select it.");
        }
    });
}

fn draw_selection_gizmos(
    mut gizmos: Gizmos,
    selected_query: Query<&GlobalTransform, With<Selected>>,
    editor_state: Res<EditorState>,
) {
    if !editor_state.show_gizmo {
        return;
    }

    for global_transform in selected_query.iter() {
        let translation = global_transform.translation();
        let rotation = global_transform.to_scale_rotation_translation().1;
        let scale = global_transform.to_scale_rotation_translation().0.max_element();

        // Draw coordinate axes (X: Red, Y: Green, Z: Blue)
        let axis_length = 1.5 * scale.max(1.0);
        
        // X-axis (Red)
        let x_end = translation + rotation.mul_vec3(Vec3::X * axis_length);
        gizmos.line(translation, x_end, Color::srgb(1.0, 0.0, 0.0));
        
        // Y-axis (Green)  
        let y_end = translation + rotation.mul_vec3(Vec3::Y * axis_length);
        gizmos.line(translation, y_end, Color::srgb(0.0, 1.0, 0.0));
        
        // Z-axis (Blue)
        let z_end = translation + rotation.mul_vec3(Vec3::Z * axis_length);
        gizmos.line(translation, z_end, Color::srgb(0.0, 0.0, 1.0));

        // Draw selection wireframe box around the object
        let box_size = Vec3::splat(0.5 * scale.max(1.0));
        gizmos.cuboid(
            Transform::from_translation(translation)
                .with_rotation(rotation)
                .with_scale(box_size),
            Color::srgba(1.0, 1.0, 0.0, 0.8), // Yellow wireframe
        );

        // Draw center point
        gizmos.sphere(translation, 0.1 * scale.max(0.1), Color::srgb(1.0, 1.0, 1.0));
        
        // Add arrow heads to axes for better visibility
        let arrow_size = 0.2 * scale.max(0.2);
        
        // X-axis arrow (Red)
        let x_arrow_start = x_end - rotation.mul_vec3(Vec3::X * arrow_size);
        gizmos.line(x_end, x_arrow_start + rotation.mul_vec3(Vec3::Y * arrow_size * 0.5), Color::srgb(1.0, 0.0, 0.0));
        gizmos.line(x_end, x_arrow_start - rotation.mul_vec3(Vec3::Y * arrow_size * 0.5), Color::srgb(1.0, 0.0, 0.0));
        
        // Y-axis arrow (Green)
        let y_arrow_start = y_end - rotation.mul_vec3(Vec3::Y * arrow_size);
        gizmos.line(y_end, y_arrow_start + rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 1.0, 0.0));
        gizmos.line(y_end, y_arrow_start - rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 1.0, 0.0));
        
        // Z-axis arrow (Blue)
        let z_arrow_start = z_end - rotation.mul_vec3(Vec3::Z * arrow_size);
        gizmos.line(z_end, z_arrow_start + rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 0.0, 1.0));
        gizmos.line(z_end, z_arrow_start - rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 0.0, 1.0));
    }
}

fn object_dragging(
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

