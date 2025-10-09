use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*};

pub fn show_selected_properties(
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

