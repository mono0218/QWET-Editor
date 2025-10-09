use bevy::prelude::*;
use bevy::render::primitives::Aabb;
use crate::{components::*, resources::*, EditorCamera};

// Helper function to check ray-AABB intersection
fn ray_aabb_intersection(ray_origin: Vec3, ray_direction: Vec3, aabb: &Aabb, transform: &GlobalTransform) -> Option<f32> {
    // Transform AABB to world space
    let aabb_min = transform.transform_point(aabb.min().into());
    let aabb_max = transform.transform_point(aabb.max().into());

    let mut tmin = (aabb_min.x - ray_origin.x) / ray_direction.x;
    let mut tmax = (aabb_max.x - ray_origin.x) / ray_direction.x;

    if tmin > tmax {
        std::mem::swap(&mut tmin, &mut tmax);
    }

    let mut tymin = (aabb_min.y - ray_origin.y) / ray_direction.y;
    let mut tymax = (aabb_max.y - ray_origin.y) / ray_direction.y;

    if tymin > tymax {
        std::mem::swap(&mut tymin, &mut tymax);
    }

    if (tmin > tymax) || (tymin > tmax) {
        return None;
    }

    if tymin > tmin {
        tmin = tymin;
    }

    if tymax < tmax {
        tmax = tymax;
    }

    let mut tzmin = (aabb_min.z - ray_origin.z) / ray_direction.z;
    let mut tzmax = (aabb_max.z - ray_origin.z) / ray_direction.z;

    if tzmin > tzmax {
        std::mem::swap(&mut tzmin, &mut tzmax);
    }

    if (tmin > tzmax) || (tzmin > tmax) {
        return None;
    }

    if tzmin > tmin {
        tmin = tzmin;
    }

    if tmin < 0.0 {
        return None;
    }

    Some(tmin)
}

pub fn object_selection(
    mut commands: Commands,
    mut editor_state: ResMut<EditorState>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
    windows: Query<&Window>,
    camera_query: Query<(&Camera, &GlobalTransform), With<EditorCamera>>,
    selectable_query: Query<(
        Entity,
        &GlobalTransform,
        Option<&Aabb>,
        Option<&BarrierMesh>,
        Option<&MovingLight>,
        Option<&ImportedGltf>,
    ), With<Selectable>>,
    selected_query: Query<Entity, With<Selected>>,
    entity_exists_query: Query<Entity>,
    mut egui_contexts: bevy_egui::EguiContexts,
    children_query: Query<&Children>,
    aabb_query: Query<(&Aabb, &GlobalTransform)>,
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
                        // AABBとの交差判定で何かにヒットしたかチェック
                        let mut hit_anything = false;

                        for (entity, transform, aabb_opt, _, _, _) in selectable_query.iter() {
                            // エンティティ自身のAABBをチェック
                            if let Some(aabb) = aabb_opt {
                                if ray_aabb_intersection(ray.origin, *ray.direction, aabb, transform).is_some() {
                                    hit_anything = true;
                                    break;
                                }
                            }

                            // 子エンティティのAABBもチェック（再帰的に）
                            fn check_children_any_hit(
                                entity: Entity,
                                children_query: &Query<&Children>,
                                aabb_query: &Query<(&Aabb, &GlobalTransform)>,
                                ray_origin: Vec3,
                                ray_direction: Vec3,
                            ) -> bool {
                                if let Ok(children) = children_query.get(entity) {
                                    for &child in children.iter() {
                                        // 子エンティティのAABBをチェック
                                        if let Ok((child_aabb, child_transform)) = aabb_query.get(child) {
                                            if ray_aabb_intersection(ray_origin, ray_direction, child_aabb, child_transform).is_some() {
                                                return true;
                                            }
                                        }

                                        // 孫エンティティもチェック
                                        if check_children_any_hit(child, children_query, aabb_query, ray_origin, ray_direction) {
                                            return true;
                                        }
                                    }
                                }
                                false
                            }

                            if check_children_any_hit(entity, &children_query, &aabb_query, ray.origin, *ray.direction) {
                                hit_anything = true;
                                break;
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
                    // 子エンティティのAABBもチェック（再帰的に）
                    fn check_children_for_hit(
                        parent_entity: Entity,
                        entity: Entity,
                        children_query: &Query<&Children>,
                        aabb_query: &Query<(&Aabb, &GlobalTransform)>,
                        ray_origin: Vec3,
                        ray_direction: Vec3,
                        closest_distance: &mut f32,
                    ) -> bool {
                        let mut found_hit = false;

                        if let Ok(children) = children_query.get(entity) {
                            for &child in children.iter() {
                                // 子エンティティのAABBをチェック
                                if let Ok((child_aabb, child_transform)) = aabb_query.get(child) {
                                    if let Some(distance) = ray_aabb_intersection(ray_origin, ray_direction, child_aabb, child_transform) {
                                        if distance < *closest_distance {
                                            *closest_distance = distance;
                                            found_hit = true;
                                            info!("Hit child {:?} of entity {:?} at distance {:.2}", child, parent_entity, distance);
                                        }
                                    }
                                }

                                // 孫エンティティもチェック
                                if check_children_for_hit(parent_entity, child, children_query, aabb_query, ray_origin, ray_direction, closest_distance) {
                                    found_hit = true;
                                }
                            }
                        }
                        found_hit
                    }

                    // AABBとの交差判定で最も近いエンティティを見つける
                    // 優先順位: BarrierMesh > MovingLight > Avatar > ImportedGltf（ステージ）
                    let mut closest_entity = None;
                    let mut closest_distance = f32::INFINITY;

                    // エンティティを分類
                    let mut barriers = Vec::new();
                    let mut lights = Vec::new();
                    let mut avatars = Vec::new();
                    let mut stages = Vec::new();

                    for (entity, transform, aabb_opt, barrier_opt, light_opt, gltf_opt) in selectable_query.iter() {
                        // エンティティの種類を判定
                        let mut entity_distance = f32::INFINITY;

                        // エンティティ自身のAABBをチェック
                        if let Some(aabb) = aabb_opt {
                            if let Some(distance) = ray_aabb_intersection(ray.origin, *ray.direction, aabb, transform) {
                                entity_distance = distance;
                            }
                        }

                        // 子エンティティのAABBもチェック
                        let mut child_distance = entity_distance;
                        if check_children_for_hit(entity, entity, &children_query, &aabb_query, ray.origin, *ray.direction, &mut child_distance) {
                            entity_distance = child_distance;
                        }

                        // ヒットした場合、種類ごとに分類
                        if entity_distance < f32::INFINITY {
                            if barrier_opt.is_some() {
                                barriers.push((entity, entity_distance));
                                info!("Found barrier hit: {:?} at distance {:.2}", entity, entity_distance);
                            } else if light_opt.is_some() {
                                lights.push((entity, entity_distance));
                                info!("Found light hit: {:?} at distance {:.2}", entity, entity_distance);
                            } else if let Some(gltf) = gltf_opt {
                                if gltf.is_avatar {
                                    avatars.push((entity, entity_distance));
                                    info!("Found avatar hit: {:?} at distance {:.2}", entity, entity_distance);
                                } else {
                                    stages.push((entity, entity_distance));
                                    info!("Found stage hit: {:?} at distance {:.2}", entity, entity_distance);
                                }
                            } else {
                                // その他のオブジェクト（ステージと同じ扱い）
                                stages.push((entity, entity_distance));
                                info!("Found other object hit: {:?} at distance {:.2}", entity, entity_distance);
                            }
                        }
                    }

                    // 優先順位順にチェック（各カテゴリ内で最も近いものを選択）
                    for entities in [&barriers, &lights, &avatars, &stages] {
                        if !entities.is_empty() {
                            // このカテゴリ内で最も近いものを見つける
                            let mut category_closest: Option<(Entity, f32)> = None;
                            for &(entity, distance) in entities {
                                if category_closest.is_none() || distance < category_closest.unwrap().1 {
                                    category_closest = Some((entity, distance));
                                }
                            }

                            if let Some((entity, distance)) = category_closest {
                                closest_entity = Some(entity);
                                closest_distance = distance;
                                info!("Selected entity {:?} from priority category at distance {:.2}", entity, distance);
                                break; // より優先度の高いカテゴリで見つかったら終了
                            }
                        }
                    }

                    // Clear previous selections
                    for entity in selected_query.iter() {
                        if entity_exists_query.get(entity).is_ok() {
                            commands.entity(entity).remove::<Selected>();
                        }
                    }

                    if let Some(entity) = closest_entity {
                        info!("Selecting closest entity: {:?} at distance {:.2}", entity, closest_distance);

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
                        info!("No entity hit by ray");
                        editor_state.selected_entity = None;

                        // Reset dragging state when deselecting all
                        editor_state.is_dragging = false;
                        editor_state.drag_start_pos = None;
                        editor_state.drag_offset = Vec3::ZERO;

                        info!("Deselected all entities - no hit");
                    }
                }
            }
        }
    }
}
