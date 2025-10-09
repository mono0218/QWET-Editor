use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*, EditorCamera};

pub fn object_selection(
    mut commands: Commands,
    mut editor_state: ResMut<EditorState>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
    windows: Query<&Window>,
    camera_query: Query<(&Camera, &GlobalTransform), With<EditorCamera>>,
    selectable_query: Query<(Entity, &GlobalTransform), With<Selectable>>,
    imported_gltf_query: Query<Entity, With<ImportedGltf>>,
    moving_light_query: Query<Entity, With<crate::components::MovingLight>>,
    barrier_mesh_query: Query<Entity, With<crate::components::BarrierMesh>>,
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
            // ダブルクリック検出
            let current_time = time.elapsed_secs_f64();
            let double_click_threshold = 0.3; // 300ms以内
            let position_threshold = 5.0; // 5ピクセル以内

            let is_double_click = if let Some(last_pos) = editor_state.last_click_pos {
                let time_diff = current_time - editor_state.last_click_time;
                let pos_diff = cursor_position.distance(last_pos);
                time_diff < double_click_threshold && pos_diff < position_threshold
            } else {
                false
            };

            // シングルクリックの場合
            if !is_double_click {
                // 時刻と位置を記録
                editor_state.last_click_time = current_time;
                editor_state.last_click_pos = Some(cursor_position);
                info!("Single click detected, waiting for double click");

                // シングルクリックで空の場所をクリックした場合、選択を解除
                if let Ok((camera, camera_transform)) = camera_query.get_single() {
                    if let Ok(ray) = camera.viewport_to_world(camera_transform, cursor_position) {
                        let mut hit_anything = false;

                        // オブジェクトにヒットしたかチェック（簡易版）
                        for (_entity, global_transform) in selectable_query.iter() {
                            let entity_pos = global_transform.translation();
                            let to_entity = entity_pos - ray.origin;
                            let projected = ray.direction.dot(to_entity);

                            if projected > 0.0 {
                                let closest_point = ray.origin + ray.direction * projected;
                                let distance_to_ray = closest_point.distance(entity_pos);

                                // 広めの判定範囲で何かにヒットしたか確認
                                if distance_to_ray < 15.0 {
                                    hit_anything = true;
                                    info!("Single click hit something, distance: {:.2}", distance_to_ray);
                                    break;
                                }
                            }
                        }

                        info!("Single click hit check: hit_anything={}", hit_anything);

                        // 何もヒットしなかった場合、選択を解除
                        if !hit_anything {
                            for entity in selected_query.iter() {
                                if entity_exists_query.get(entity).is_ok() {
                                    commands.entity(entity).remove::<Selected>();
                                }
                            }
                            editor_state.selected_entity = None;
                            editor_state.is_dragging = false;
                            editor_state.drag_start_pos = None;
                            editor_state.drag_offset = Vec3::ZERO;
                            info!("Deselected all: clicked on empty space");
                        }
                    }
                }

                return;
            }

            // ダブルクリック検出後、記録をリセット
            info!("Double click detected! Starting selection process");
            editor_state.last_click_time = 0.0;
            editor_state.last_click_pos = None;
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
                    
                    // Second priority: try to select BarrierMesh if no MovingLight found
                    if closest_entity.is_none() {
                        for barrier_entity in barrier_mesh_query.iter() {
                            if let Ok((_, global_transform)) = selectable_query.get(barrier_entity) {
                                let entity_pos = global_transform.translation();
                                let to_entity = entity_pos - ray.origin;
                                let projected = ray.direction.dot(to_entity);

                                if projected > 0.0 {
                                    let closest_point = ray.origin + ray.direction * projected;
                                    let distance_to_ray = closest_point.distance(entity_pos);
                                    let distance_from_camera = entity_pos.distance(ray.origin);

                                    // BarrierMesh with large selection radius
                                    if distance_to_ray < 12.0 && distance_from_camera < closest_distance {
                                        closest_distance = distance_from_camera;
                                        closest_entity = Some(barrier_entity);
                                        info!("Found BarrierMesh selection: Entity {:?}, distance: {:.2}", barrier_entity, distance_from_camera);
                                    }
                                }
                            }
                        }
                    }

                    // Third priority: try to select imported GLTF models if no MovingLight or BarrierMesh found
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
