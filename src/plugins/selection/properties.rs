use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*};

pub fn show_selected_properties(
    mut contexts: bevy_egui::EguiContexts,
    editor_state: Res<EditorState>,
    mut selected_query: Query<(Entity, Option<&ImportedGltf>, Option<&MovingLight>, Option<&mut BarrierMesh>, &mut Transform), With<Selected>>,
) {
    let ctx = contexts.ctx_mut();

    // Always show the right panel
    egui::SidePanel::right("properties_panel").default_width(300.0).show(ctx, |ui| {
        ui.heading("Properties");

        if let Some(selected_entity) = editor_state.selected_entity {
            if let Ok((entity, imported_gltf, moving_light, barrier_mesh, mut transform)) = selected_query.get_mut(selected_entity) {
                ui.heading("Selected Object");
                ui.label(format!("Entity: {:?}", entity));

                if let Some(imported_gltf) = imported_gltf {
                    ui.label(format!("Imported GLTF: {}", imported_gltf.path.display()));
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

                // Rotation controls (in degrees)
                ui.separator();
                ui.label("Rotation (degrees):");
                let (mut pitch, mut yaw, mut roll) = transform.rotation.to_euler(EulerRot::XYZ);
                pitch = pitch.to_degrees();
                yaw = yaw.to_degrees();
                roll = roll.to_degrees();

                let mut rotation_changed = false;
                ui.horizontal(|ui| {
                    ui.label("X:");
                    rotation_changed |= ui.add(egui::DragValue::new(&mut pitch).speed(1.0)).changed();
                    ui.label("Y:");
                    rotation_changed |= ui.add(egui::DragValue::new(&mut yaw).speed(1.0)).changed();
                    ui.label("Z:");
                    rotation_changed |= ui.add(egui::DragValue::new(&mut roll).speed(1.0)).changed();
                });

                if rotation_changed {
                    transform.rotation = Quat::from_euler(EulerRot::XYZ, pitch.to_radians(), yaw.to_radians(), roll.to_radians());
                }

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

                if let Some(mut barrier) = barrier_mesh {
                    ui.separator();
                    ui.heading("Barrier Mesh Properties");

                    // 名前
                    ui.label(format!("Name: {}", barrier.name));

                    // サイズ調整
                    ui.label("Size:");
                    ui.horizontal(|ui| {
                        ui.label("Width:");
                        ui.add(egui::DragValue::new(&mut barrier.size.x).speed(0.1).range(0.1..=100.0));
                    });
                    ui.horizontal(|ui| {
                        ui.label("Height:");
                        ui.add(egui::DragValue::new(&mut barrier.size.y).speed(0.1).range(0.1..=100.0));
                    });
                    ui.horizontal(|ui| {
                        ui.label("Depth:");
                        ui.add(egui::DragValue::new(&mut barrier.size.z).speed(0.1).range(0.01..=10.0));
                    });

                    // 色設定
                    ui.separator();
                    ui.label("Color (RGBA):");
                    let mut color_array = [
                        barrier.color.to_srgba().red,
                        barrier.color.to_srgba().green,
                        barrier.color.to_srgba().blue,
                        barrier.color.to_srgba().alpha,
                    ];
                    ui.color_edit_button_rgba_unmultiplied(&mut color_array);
                    barrier.color = Color::srgba(color_array[0], color_array[1], color_array[2], color_array[3]);

                    // 表示/非表示トグル
                    ui.separator();
                    ui.checkbox(&mut barrier.visible, "Visible");
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

