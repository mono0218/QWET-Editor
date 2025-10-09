use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*};
use super::types::*;
use super::events::*;

pub fn timeline_ui(
    mut contexts: EguiContexts,
    mut timeline: ResMut<TimelineState>,
    mut light_groups: ResMut<LightGroups>,
    mut create_group_events: EventWriter<CreateGroupEvent>,
    mut add_light_events: EventWriter<AddLightToGroupEvent>,
    mut create_keyframe_events: EventWriter<CreateKeyframeEvent>,
    mut delete_keyframe_events: EventWriter<DeleteKeyframeEvent>,
    mut edit_keyframe_events: EventWriter<EditKeyframeEvent>,
    light_query: Query<(Entity, &MovingLight, &Transform), With<MovingLight>>,
    editor_state: Res<EditorState>,
) {
    // Timeline editor is always visible
    
    let ctx = contexts.ctx_mut();

    // Blender-style horizontal timeline at the bottom with highest Z-order
    let screen_rect = ctx.screen_rect();
    let timeline_height = timeline.panel_height.clamp(200.0, 800.0);
    
    let timeline_rect = egui::Rect::from_min_size(
        egui::pos2(0.0, screen_rect.height() - timeline_height),
        egui::vec2(screen_rect.width(), timeline_height)
    );
    
    let panel_response = egui::Area::new(egui::Id::new("timeline_editor"))
        .order(egui::Order::Foreground)
        .fixed_pos(timeline_rect.min)
        .show(ctx, |ui| {
            // Set the area size to match our calculated rect
            ui.allocate_exact_size(timeline_rect.size(), egui::Sense::hover());
            
            // Add a background to make it look like a panel
            ui.painter().rect_filled(
                timeline_rect,
                0.0,
                ctx.style().visuals.panel_fill
            );
            
            // Add resize handle at the top
            let resize_rect = egui::Rect::from_min_size(
                timeline_rect.min,
                egui::vec2(screen_rect.width(), 4.0)
            );
            let resize_response = ui.allocate_rect(resize_rect, egui::Sense::drag());
            if resize_response.dragged() {
                let delta = resize_response.drag_delta();
                timeline.panel_height = (timeline.panel_height - delta.y).clamp(200.0, 800.0);
            }
            
            // Style the resize handle
            let resize_color = if resize_response.hovered() {
                ctx.style().visuals.widgets.hovered.bg_fill
            } else {
                ctx.style().visuals.widgets.inactive.bg_fill
            };
            ui.painter().rect_filled(resize_rect, 2.0, resize_color);
            
            // Content area (excluding resize handle)
            let content_rect = egui::Rect::from_min_size(
                egui::pos2(timeline_rect.min.x + 10.0, timeline_rect.min.y + 10.0),
                egui::vec2(timeline_rect.width() - 20.0, timeline_rect.height() - 20.0)
            );
            
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(content_rect), |ui| {
                egui::ScrollArea::both()
                    .auto_shrink(false)
                    .show(ui, |ui| {
            ui.heading("🎬 Timeline Editor");
            
            // Group selection dropdown
            ui.horizontal(|ui| {
                ui.label("Light Group:");
                
                let selected_text = timeline.selected_group.as_ref()
                    .map(|s| s.as_str())
                    .unwrap_or("Select Group...");
                
                egui::ComboBox::from_id_salt("group_selector")
                    .selected_text(selected_text)
                    .show_ui(ui, |ui| {
                        for group_name in light_groups.groups.keys() {
                            let is_selected = timeline.selected_group.as_ref() == Some(group_name);
                            if ui.selectable_label(is_selected, group_name).clicked() {
                                timeline.selected_group = Some(group_name.clone());
                            }
                        }
                    });
                
                ui.separator();
            });
            
            // Transport controls
            ui.horizontal(|ui| {
                if ui.button(if timeline.is_playing { "⏸" } else { "▶" }).clicked() {
                    timeline.is_playing = !timeline.is_playing;
                }
                
                if ui.button("⏹").clicked() {
                    timeline.is_playing = false;
                    timeline.current_time = 0.0;
                }
                
                if ui.button("⏮").clicked() {
                    timeline.current_time = 0.0;
                }
                
                if ui.button("⏭").clicked() {
                    timeline.current_time = timeline.total_time;
                }
                
                ui.separator();
                
                ui.label("Time:");
                let total_time = timeline.total_time;
                ui.add(egui::DragValue::new(&mut timeline.current_time)
                    .speed(0.1)
                    .range(0.0..=total_time)
                    .suffix("s"));
                
                ui.separator();
                
                // Group management
                ui.label("Groups:");
                
                // Create new group button
                if ui.button("➕ New Group").clicked() {
                    let group_name = format!("Group_{}", light_groups.groups.len() + 1);
                    create_group_events.send(CreateGroupEvent { name: group_name });
                }
            });
            
            // Playback controls
            ui.horizontal(|ui| {
                if ui.button(if timeline.is_playing { "⏸ Pause" } else { "▶ Play" }).clicked() {
                    timeline.is_playing = !timeline.is_playing;
                }
                if ui.button("⏹ Stop").clicked() {
                    timeline.is_playing = false;
                    timeline.current_time = 0.0;
                }
                ui.label(format!("Time: {:.1}s / {:.1}s", timeline.current_time, timeline.total_time));
            });
            
            ui.separator();
            
            // Show timeline tracks only if a group is selected
            if let Some(selected_group_name) = &timeline.selected_group {
                if let Some(group) = light_groups.groups.get(selected_group_name) {
                    ui.heading(format!("🎭 {} Tracks", selected_group_name));
                    
                    let available_width = ui.available_width();
                    let track_label_width = 120.0;
                    let timeline_width = available_width - track_label_width - 20.0; // Add margin
                    let pixels_per_second = timeline_width / timeline.total_time * timeline.zoom;
                    
                    // Define tracks to show
                    let tracks = vec![
                        ("🔄 Pan", TimelineTrack::Pan, 0.0, 360.0),
                        ("⬇️ Tilt", TimelineTrack::Tilt, -90.0, 90.0),
                        ("🌈 RGB", TimelineTrack::RGB, 0.0, 1.0),
                        ("💡 Intensity", TimelineTrack::Intensity, 0.0, 1.0),
                    ];
                    
                    // Use a consistent layout for all tracks with horizontal scrolling
                    egui::ScrollArea::horizontal()
                        .auto_shrink(false)
                        .show(ui, |ui| {
                    ui.vertical(|ui| {
                        for (track_name, track_type, _min_val, _max_val) in tracks {
                            ui.horizontal(|ui| {
                                // Fixed-width track label area
                                ui.allocate_ui_with_layout(
                                    egui::Vec2::new(track_label_width, 30.0),
                                    egui::Layout::left_to_right(egui::Align::Center),
                                    |ui| {
                                        ui.add_sized([track_label_width, 20.0], egui::Label::new(track_name));
                                    }
                                );
                                
                                // Fixed margin to align timeline start
                                ui.add_space(10.0);
                                
                                // Timeline area with consistent positioning
                                let (timeline_rect, timeline_response) = ui.allocate_exact_size(
                                    egui::Vec2::new(timeline_width, 30.0),
                                    egui::Sense::click()
                                );
                                
                                // Draw timeline background
                                ui.painter().rect_filled(
                                    timeline_rect,
                                    2.0,
                                    egui::Color32::from_gray(40)
                                );
                                
                                // Draw time markers
                                for i in 0..=(timeline.total_time as i32) {
                                    let x = timeline_rect.left() + (i as f32 * pixels_per_second);
                                    if x <= timeline_rect.right() {
                                        ui.painter().line_segment(
                                            [egui::pos2(x, timeline_rect.top()), egui::pos2(x, timeline_rect.bottom())],
                                            egui::Stroke::new(1.0, egui::Color32::from_gray(80))
                                        );
                                    }
                                }
                                
                                // Draw current time indicator
                                let current_x = timeline_rect.left() + (timeline.current_time * pixels_per_second);
                                if current_x >= timeline_rect.left() && current_x <= timeline_rect.right() {
                                    ui.painter().line_segment(
                                        [egui::pos2(current_x, timeline_rect.top()), egui::pos2(current_x, timeline_rect.bottom())],
                                        egui::Stroke::new(2.0, egui::Color32::YELLOW)
                                    );
                                }
                                
                                // Draw keyframes for this track with right-click deletion
                                for (keyframe_index, keyframe) in group.keyframes.iter().enumerate() {
                                    let has_value = match track_type {
                                        TimelineTrack::Pan => keyframe.pan.is_some(),
                                        TimelineTrack::Tilt => keyframe.tilt.is_some(),
                                        TimelineTrack::RGB => keyframe.red.is_some() && keyframe.green.is_some() && keyframe.blue.is_some(),
                                        TimelineTrack::Intensity => keyframe.intensity.is_some(),
                                    };
                                    
                                    if has_value {
                                        let keyframe_x = timeline_rect.left() + (keyframe.time * pixels_per_second);
                                        if keyframe_x >= timeline_rect.left() && keyframe_x <= timeline_rect.right() {
                                            let keyframe_pos = egui::pos2(keyframe_x, timeline_rect.center().y);
                                            
                                            // Create a small rect around the keyframe for interaction
                                            let keyframe_rect = egui::Rect::from_center_size(
                                                keyframe_pos,
                                                egui::Vec2::splat(12.0) // 6px radius for interaction
                                            );
                                            
                                            // Check for clicks on keyframe
                                            let keyframe_response = ui.allocate_rect(keyframe_rect, egui::Sense::click());
                                            if keyframe_response.clicked() {
                                                // Left click to edit
                                                edit_keyframe_events.send(EditKeyframeEvent {
                                                    group_name: selected_group_name.clone(),
                                                    keyframe_index,
                                                });
                                            }
                                            if keyframe_response.secondary_clicked() {
                                                // Right click to delete
                                                delete_keyframe_events.send(DeleteKeyframeEvent {
                                                    group_name: selected_group_name.clone(),
                                                    keyframe_index,
                                                });
                                            }
                                            
                                            // Draw the keyframe
                                            let color = if keyframe_response.hovered() {
                                                egui::Color32::from_rgb(255, 100, 100) // Red on hover for deletion hint
                                            } else {
                                                egui::Color32::from_rgb(255, 140, 0) // Normal orange
                                            };
                                            
                                            ui.painter().circle_filled(keyframe_pos, 4.0, color);
                                        }
                                    }
                                }
                                
                                // Handle clicks to add keyframes
                                if timeline_response.clicked() {
                                    if let Some(click_pos) = timeline_response.interact_pointer_pos() {
                                        let click_time = (click_pos.x - timeline_rect.left()) / pixels_per_second;
                                        if click_time >= 0.0 && click_time <= timeline.total_time {
                                            // Set default value for the track type
                                            match track_type {
                                                TimelineTrack::Pan => {
                                                    create_keyframe_events.send(CreateKeyframeEvent {
                                                        group_name: selected_group_name.clone(),
                                                        time: click_time,
                                                        track: track_type.clone(),
                                                        value: 180.0, // Center pan
                                                        rgb_values: None,
                                                    });
                                                },
                                                TimelineTrack::Tilt => {
                                                    create_keyframe_events.send(CreateKeyframeEvent {
                                                        group_name: selected_group_name.clone(),
                                                        time: click_time,
                                                        track: track_type.clone(),
                                                        value: 0.0, // Center tilt
                                                        rgb_values: None,
                                                    });
                                                },
                                                TimelineTrack::RGB => {
                                                    create_keyframe_events.send(CreateKeyframeEvent {
                                                        group_name: selected_group_name.clone(),
                                                        time: click_time,
                                                        track: track_type.clone(),
                                                        value: 0.0, // Not used for RGB
                                                        rgb_values: Some((1.0, 1.0, 1.0)), // Default white
                                                    });
                                                },
                                                TimelineTrack::Intensity => {
                                                    create_keyframe_events.send(CreateKeyframeEvent {
                                                        group_name: selected_group_name.clone(),
                                                        time: click_time,
                                                        track: track_type.clone(),
                                                        value: 1.0,
                                                        rgb_values: None,
                                                    });
                                                },
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                    });
                } else {
                    ui.colored_label(egui::Color32::YELLOW, "Selected group not found");
                }
            } else {
                ui.colored_label(egui::Color32::GRAY, "Select a light group to edit its timeline");
            }
            
            // Keyframe editing UI
            if let Some((editing_group, editing_index)) = &timeline.editing_keyframe.clone() {
                if let Some(group) = light_groups.groups.get_mut(editing_group) {
                    if let Some(keyframe) = group.keyframes.get_mut(*editing_index) {
                        ui.separator();
                        ui.heading("🎛️ Edit Keyframe");
                        
                        ui.horizontal(|ui| {
                            ui.label("Time:");
                            ui.add(egui::DragValue::new(&mut keyframe.time).suffix("s").speed(0.1));
                        });
                        
                        if let Some(ref mut pan) = keyframe.pan {
                            ui.horizontal(|ui| {
                                ui.label("🔄 Pan:");
                                ui.add(egui::Slider::new(pan, 0.0..=360.0).suffix("°"));
                            });
                        }
                        
                        if let Some(ref mut tilt) = keyframe.tilt {
                            ui.horizontal(|ui| {
                                ui.label("⬇️ Tilt:");
                                ui.add(egui::Slider::new(tilt, -90.0..=90.0).suffix("°"));
                            });
                        }
                        
                        if keyframe.red.is_some() && keyframe.green.is_some() && keyframe.blue.is_some() {
                            let mut color_array = [
                                keyframe.red.unwrap_or(1.0),
                                keyframe.green.unwrap_or(1.0),
                                keyframe.blue.unwrap_or(1.0),
                            ];
                            ui.horizontal(|ui| {
                                ui.label("🌈 RGB:");
                                if ui.color_edit_button_rgb(&mut color_array).changed() {
                                    keyframe.red = Some(color_array[0]);
                                    keyframe.green = Some(color_array[1]);
                                    keyframe.blue = Some(color_array[2]);
                                }
                            });
                        }
                        
                        if let Some(ref mut intensity) = keyframe.intensity {
                            ui.horizontal(|ui| {
                                ui.label("💡 Intensity:");
                                ui.add(egui::Slider::new(intensity, 0.0..=1.0));
                            });
                        }
                        
                        ui.horizontal(|ui| {
                            if ui.button("✅ Done").clicked() {
                                timeline.editing_keyframe = None;
                            }
                            if ui.button("❌ Cancel").clicked() {
                                timeline.editing_keyframe = None;
                            }
                        });
                    }
                }
            }
                    });
            });
        });
    
    // Height is now controlled by the drag handle, so no need to save from response
}

