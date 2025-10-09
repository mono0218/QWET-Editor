use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*};

pub fn moving_light_controls(
    mut contexts: EguiContexts,
    editor_state: Res<EditorState>,
    mut light_query: Query<(&mut MovingLight, &mut Transform, &mut SpotLight), With<Selected>>,
    light_groups: Res<crate::plugins::timeline_editor::LightGroups>,
) {
    // MovingLight controls are only available in Select mode (not in Animation mode)
    // This prevents overlap with timeline editor
    
    if let Some(_selected_entity) = editor_state.selected_entity {
        if editor_state.show_properties {
        if let Ok((mut moving_light, mut transform, mut spot_light)) = light_query.get_single_mut() {
            let ctx = contexts.ctx_mut();
            
            egui::Window::new("🎭 BeamLight Controls")
                .default_width(350.0)
                .max_height(600.0)
                .resizable(true)
                .scroll(true)
                .show(ctx, |ui| {
                    ui.heading("BeamLight Controls");
                    ui.label(format!("🏷️ Name: {}", moving_light.name));
                    
                    ui.separator();
                    
                    // Pan/Tilt Section - Blender-style
                    ui.heading("🔄 Pan & Tilt");
                    
                    // Large visual pan/tilt control area
                    let (rect, response) = ui.allocate_exact_size(
                        egui::Vec2::new(200.0, 150.0),
                        egui::Sense::click_and_drag()
                    );
                    
                    if ui.is_rect_visible(rect) {
                        let painter = ui.painter();
                        painter.rect_filled(rect, 5.0, egui::Color32::from_gray(40));
                        
                        // Draw crosshairs
                        let center = rect.center();
                        painter.line_segment(
                            [egui::pos2(rect.left(), center.y), egui::pos2(rect.right(), center.y)],
                            egui::Stroke::new(1.0, egui::Color32::GRAY)
                        );
                        painter.line_segment(
                            [egui::pos2(center.x, rect.top()), egui::pos2(center.x, rect.bottom())],
                            egui::Stroke::new(1.0, egui::Color32::GRAY)
                        );
                        
                        // Draw current position
                        let pan_norm = (moving_light.pan.to_degrees() + 180.0) / 360.0;
                        let tilt_norm = (moving_light.tilt.to_degrees() + 90.0) / 180.0;
                        let pos = egui::pos2(
                            rect.left() + rect.width() * pan_norm,
                            rect.top() + rect.height() * (1.0 - tilt_norm)
                        );
                        painter.circle_filled(pos, 8.0, egui::Color32::YELLOW);
                        
                        // Handle drag interaction
                        if response.dragged() {
                            if let Some(pointer_pos) = response.interact_pointer_pos() {
                                let rel_x = (pointer_pos.x - rect.left()) / rect.width();
                                let rel_y = 1.0 - (pointer_pos.y - rect.top()) / rect.height();
                                
                                moving_light.pan = ((rel_x * 360.0) - 180.0).to_radians().clamp(-std::f32::consts::PI, std::f32::consts::PI);
                                moving_light.tilt = ((rel_y * 180.0) - 90.0).to_radians().clamp(-std::f32::consts::FRAC_PI_2, std::f32::consts::FRAC_PI_2);
                                
                                // Pan/Tiltはメッシュのみ制御、ルートエンティティの回転は変更しない
                            }
                        }
                    }
                    
                    // Precise sliders
                    ui.horizontal(|ui| {
                        ui.label("Pan:");
                        let mut pan_degrees = moving_light.pan.to_degrees();
                        if ui.add(egui::Slider::new(&mut pan_degrees, -180.0..=180.0).suffix("°")).changed() {
                            moving_light.pan = pan_degrees.to_radians();
                            // Pan/Tiltはメッシュのみ制御、ルートエンティティの回転は変更しない
                        }
                    });
                    
                    ui.horizontal(|ui| {
                        ui.label("Tilt:");
                        let mut tilt_degrees = moving_light.tilt.to_degrees();
                        if ui.add(egui::Slider::new(&mut tilt_degrees, -90.0..=90.0).suffix("°")).changed() {
                            moving_light.tilt = tilt_degrees.to_radians();
                            // Pan/Tiltはメッシュのみ制御、ルートエンティティの回転は変更しない
                        }
                    });
                    
                    ui.separator();
                    
                    // Color & Intensity Section
                    ui.heading("🌈 Color & Intensity");
                    
                    let mut color_array = [
                        moving_light.color.to_linear().red,
                        moving_light.color.to_linear().green,
                        moving_light.color.to_linear().blue,
                    ];
                    
                    if ui.color_edit_button_rgb(&mut color_array).changed() {
                        moving_light.color = Color::LinearRgba(LinearRgba::rgb(
                            color_array[0],
                            color_array[1], 
                            color_array[2]
                        ));
                        spot_light.color = moving_light.color;
                    }
                    
                    ui.horizontal(|ui| {
                        ui.label("💡 Intensity:");
                        if ui.add(egui::Slider::new(&mut moving_light.intensity, 0.0..=5.0).suffix("x")).changed() {
                            spot_light.intensity = moving_light.intensity * 1000.0;
                        }
                    });
                    
                    ui.horizontal(|ui| {
                        ui.label("📐 Beam Angle:");
                        if ui.add(egui::Slider::new(&mut moving_light.beam_angle, 5.0..=80.0).suffix("°")).changed() {
                            spot_light.outer_angle = moving_light.beam_angle.to_radians();
                            spot_light.inner_angle = (moving_light.beam_angle * 0.8).to_radians();
                        }
                    });
                    
                    ui.separator();
                    
                    // Quick Color Presets
                    ui.heading("🎨 Color Presets");
                    ui.horizontal(|ui| {
                        if ui.button("⚪ White").clicked() {
                            moving_light.color = Color::WHITE;
                            spot_light.color = Color::WHITE;
                        }
                        if ui.button("🔴 Red").clicked() {
                            moving_light.color = Color::srgb(1.0, 0.0, 0.0);
                            spot_light.color = moving_light.color;
                        }
                        if ui.button("🟢 Green").clicked() {
                            moving_light.color = Color::srgb(0.0, 1.0, 0.0);
                            spot_light.color = moving_light.color;
                        }
                        if ui.button("🔵 Blue").clicked() {
                            moving_light.color = Color::srgb(0.0, 0.0, 1.0);
                            spot_light.color = moving_light.color;
                        }
                    });
                    
                    ui.horizontal(|ui| {
                        if ui.button("🟡 Yellow").clicked() {
                            moving_light.color = Color::srgb(1.0, 1.0, 0.0);
                            spot_light.color = moving_light.color;
                        }
                        if ui.button("🟣 Magenta").clicked() {
                            moving_light.color = Color::srgb(1.0, 0.0, 1.0);
                            spot_light.color = moving_light.color;
                        }
                        if ui.button("🟠 Orange").clicked() {
                            moving_light.color = Color::srgb(1.0, 0.5, 0.0);
                            spot_light.color = moving_light.color;
                        }
                    });
                    
                    ui.separator();
                    
                    // Light Group Assignment
                    ui.heading("🎯 Light Group");
                    
                    // Current group display
                    let current_group = moving_light.group_id.as_ref()
                        .map(|id| id.as_str())
                        .unwrap_or("None");
                    ui.label(format!("Current Group: {}", current_group));
                    
                    // Group selection dropdown
                    egui::ComboBox::from_label("Assign to Group")
                        .selected_text(current_group)
                        .show_ui(ui, |ui| {
                            // Option to remove from group
                            if ui.selectable_label(moving_light.group_id.is_none(), "None").clicked() {
                                moving_light.group_id = None;
                            }
                            
                            // List all available groups
                            for group_name in light_groups.groups.keys() {
                                let is_selected = moving_light.group_id.as_ref() == Some(group_name);
                                if ui.selectable_label(is_selected, group_name).clicked() {
                                    moving_light.group_id = Some(group_name.clone());
                                }
                            }
                        });
                });
            }
        }
    }
}

