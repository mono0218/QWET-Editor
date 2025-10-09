use bevy::prelude::*;
use bevy::core_pipeline::bloom::Bloom;
use bevy_egui::{egui, EguiContexts};
use crate::resources::*;
use super::plugin::EditorCamera;

pub fn editor_ui(
    mut commands: Commands,
    mut contexts: EguiContexts,
    mut editor_state: ResMut<EditorState>,
    scene_data: Res<SceneData>,
    mut import_events: EventWriter<crate::plugins::filemanager::ImportGltfEvent>,
    mut save_events: EventWriter<crate::plugins::scene_manager::SaveSceneEvent>,
    mut load_events: EventWriter<crate::plugins::scene_manager::LoadSceneEvent>,
    mut new_events: EventWriter<crate::plugins::scene_manager::NewSceneEvent>,
    mut add_light_events: EventWriter<crate::plugins::moving_light::AddLightEvent>,
    mut avatar_import_events: EventWriter<crate::plugins::filemanager::ImportAvatarEvent>,
    mut export_events: EventWriter<crate::plugins::filemanager::ExportProjectEvent>,
    mut project_import_events: EventWriter<crate::plugins::filemanager::ImportProjectEvent>,
    mut add_barrier_events: EventWriter<crate::plugins::barrier_mesh::AddBarrierEvent>,
) {
    let ctx = contexts.ctx_mut();

    // Top menu bar
    egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
        egui::menu::bar(ui, |ui| {
            ui.menu_button("File", |ui| {
                if ui.button("New Scene").clicked() {
                    new_events.send(crate::plugins::scene_manager::NewSceneEvent);
                    info!("New Scene created");
                }
                if ui.button("Open Scene").clicked() {
                    if let Some(path) = rfd::FileDialog::new()
                        .add_filter("QWET Scene", &["json"])
                        .set_directory("./scenes")
                        .pick_file()
                    {
                        load_events.send(crate::plugins::scene_manager::LoadSceneEvent { path });
                        info!("Loading scene from file");
                    }
                }
                if ui.button("Save Scene").clicked() {
                    if let Some(path) = rfd::FileDialog::new()
                        .add_filter("QWET Scene", &["json"])
                        .set_directory("./scenes")
                        .set_file_name("scene.json")
                        .save_file()
                    {
                        save_events.send(crate::plugins::scene_manager::SaveSceneEvent { path });
                        info!("Saving scene to file");
                    }
                }
                ui.separator();
                if ui.button("Import GLB").clicked() {
                    info!("Import GLB clicked - triggering file dialog");
                    let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                        rfd::AsyncFileDialog::new()
                            .add_filter("3D Models", &["glb", "gltf"])
                            .set_directory("./assets")
                            .pick_file()
                            .await
                    });
                    commands.insert_resource(GltfFileDialogTask { task: Some(task) });
                }
                if ui.button("Import Avatar GLB").clicked() {
                    info!("Import Avatar GLB clicked - triggering file dialog");
                    let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                        rfd::AsyncFileDialog::new()
                            .add_filter("3D Models", &["glb", "gltf"])
                            .set_directory("./assets")
                            .set_title("Select Avatar Model")
                            .pick_file()
                            .await
                    });
                    commands.insert_resource(AvatarFileDialogTask { task: Some(task) });
                }
                ui.separator();
                if ui.button("Import Project").clicked() {
                    // Trigger async file dialog
                    project_import_events.send(crate::plugins::filemanager::ImportProjectEvent {
                        file_path: std::path::PathBuf::new() // Empty path triggers file dialog
                    });
                    info!("Triggering QWET project import dialog...");
                }
                if ui.button("Export Project").clicked() {
                    // Trigger async file dialog
                    export_events.send(crate::plugins::filemanager::ExportProjectEvent {
                        path: std::path::PathBuf::new() // Empty path triggers file dialog
                    });
                    info!("Triggering QWET project export dialog...");
                }
            });

            ui.menu_button("Edit", |ui| {
                if ui.button("Add MovingLight").clicked() {
                    editor_state.tool_mode = ToolMode::Select; // Switch to select mode after adding
                    // Send event to trigger light placement
                    add_light_events.send(crate::plugins::moving_light::AddLightEvent);
                    info!("Add MovingLight selected");
                }
                if ui.button("Add Barrier Mesh").clicked() {
                    editor_state.tool_mode = ToolMode::Select;
                    add_barrier_events.send(crate::plugins::barrier_mesh::AddBarrierEvent);
                    info!("Add Barrier Mesh clicked");
                }
                ui.separator();
                if ui.button("Undo").clicked() {
                    info!("Undo clicked");
                }
                if ui.button("Redo").clicked() {
                    info!("Redo clicked");
                }
            });

            ui.menu_button("View", |ui| {
                ui.checkbox(&mut editor_state.show_gizmo, "Show Gizmos");
                ui.checkbox(&mut editor_state.show_properties, "Show Properties");
                ui.checkbox(&mut editor_state.bloom_enabled, "Enable Bloom");
            });
        });
    });

    // Left panel - Tool palette
    egui::SidePanel::left("tool_panel").default_width(200.0).show(ctx, |ui| {
        ui.heading("Tools");

        if ui.selectable_label(matches!(editor_state.tool_mode, ToolMode::Select), "Select").clicked() {
            editor_state.tool_mode = ToolMode::Select;
            info!("Select tool selected");
        }


        if ui.selectable_label(matches!(editor_state.tool_mode, ToolMode::Animation), "Animation").clicked() {
            editor_state.tool_mode = ToolMode::Animation;
            info!("Animation tool selected");
        }

        ui.separator();
        ui.heading("Scene Objects");

        ui.label(format!("Models: {}", scene_data.imported_models.len()));
    });
}

pub fn toggle_bloom_system(
    editor_state: Res<EditorState>,
    mut camera_query: Query<&mut Bloom, With<EditorCamera>>,
) {
    if editor_state.is_changed() {
        if let Ok(mut bloom_settings) = camera_query.get_single_mut() {
            if editor_state.bloom_enabled {
                *bloom_settings = Bloom::NATURAL;
            } else {
                bloom_settings.intensity = 0.0;
            }
        }
    }
}

#[derive(Resource)]
pub struct GltfFileDialogTask {
    pub task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}

#[derive(Resource)]
pub struct AvatarFileDialogTask {
    pub task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}

pub fn poll_gltf_file_dialog(
    mut commands: Commands,
    task_resource: Option<ResMut<GltfFileDialogTask>>,
    mut import_events: EventWriter<crate::plugins::filemanager::ImportGltfEvent>,
) {
    if let Some(mut task_res) = task_resource {
        if let Some(mut task) = task_res.task.take() {
            if let Some(result) = bevy::tasks::block_on(bevy::tasks::poll_once(&mut task)) {
                if let Some(file_handle) = result {
                    let path = file_handle.path().to_path_buf();
                    info!("GLB file selected: {:?}", path);
                    import_events.send(crate::plugins::filemanager::ImportGltfEvent { path });
                } else {
                    info!("GLB file selection cancelled");
                }
                commands.remove_resource::<GltfFileDialogTask>();
            } else {
                task_res.task = Some(task);
            }
        }
    }
}

pub fn poll_avatar_file_dialog(
    mut commands: Commands,
    task_resource: Option<ResMut<AvatarFileDialogTask>>,
    mut import_events: EventWriter<crate::plugins::filemanager::ImportAvatarEvent>,
) {
    if let Some(mut task_res) = task_resource {
        if let Some(mut task) = task_res.task.take() {
            if let Some(result) = bevy::tasks::block_on(bevy::tasks::poll_once(&mut task)) {
                if let Some(file_handle) = result {
                    let path = file_handle.path().to_path_buf();
                    info!("Avatar GLB file selected: {:?}", path);
                    import_events.send(crate::plugins::filemanager::ImportAvatarEvent { path });
                } else {
                    info!("Avatar GLB file selection cancelled");
                }
                commands.remove_resource::<AvatarFileDialogTask>();
            } else {
                task_res.task = Some(task);
            }
        }
    }
}
