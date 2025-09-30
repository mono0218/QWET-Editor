use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*, export::*};
use crate::plugins::timeline_editor::{LightGroups, TimelineState};
use std::path::PathBuf;
use std::fs;
use base64::{Engine as _, engine::general_purpose};

pub struct ProjectExportPlugin;

impl Plugin for ProjectExportPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<ExportState>()
            .add_event::<ExportProjectEvent>()
            .add_systems(Update, (
                export_ui,
                handle_export_project,
                poll_export_file_dialog,
                export_project_to_file,
            ));
    }
}

#[derive(Resource, Default)]
struct ExportState {
    export_trigger: bool,
    last_export_path: Option<PathBuf>,
    export_status: Option<String>,
}

#[derive(Event)]
pub struct ExportProjectEvent {
    pub path: PathBuf,
}

#[derive(Resource)]
struct ExportFileDialogTask {
    task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}

fn export_ui(
    mut contexts: EguiContexts,
    mut export_state: ResMut<ExportState>,
    _export_events: EventWriter<ExportProjectEvent>,
) {
    let ctx = contexts.ctx_mut();

    egui::Window::new("💾 Project Export")
        .default_width(300.0)
        .resizable(true)
        .show(ctx, |ui| {
            ui.heading("Export QWET Project");
            
            ui.label("Export current project to .qwet file");
            ui.separator();

            if ui.button("💾 Export Project").clicked() {
                export_state.export_trigger = true;
            }

            if let Some(ref path) = export_state.last_export_path {
                ui.label(format!("Last exported: {}", path.display()));
            }

            if let Some(ref status) = export_state.export_status {
                ui.separator();
                if status.contains("successfully") {
                    ui.colored_label(egui::Color32::GREEN, status);
                } else {
                    ui.colored_label(egui::Color32::RED, status);
                }
                
                if ui.button("Clear Status").clicked() {
                    export_state.export_status = None;
                }
            }
        });

    // キーボードショートカット (Ctrl+E)
    ctx.input(|i| {
        if i.key_pressed(egui::Key::E) && i.modifiers.ctrl {
            export_state.export_trigger = true;
        }
    });
}

fn handle_export_project(
    mut export_state: ResMut<ExportState>,
    _export_events: EventWriter<ExportProjectEvent>,
    mut commands: Commands,
) {
    if export_state.export_trigger {
        export_state.export_trigger = false;
        
        info!("Triggering export file dialog...");
        
        let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
            rfd::AsyncFileDialog::new()
                .add_filter("QWET Project", &["qwet"])
                .set_file_name("project.qwet")
                .save_file()
                .await
        });
        
        commands.insert_resource(ExportFileDialogTask { task: Some(task) });
    }
}

fn poll_export_file_dialog(
    mut commands: Commands,
    task_resource: Option<ResMut<ExportFileDialogTask>>,
    mut export_events: EventWriter<ExportProjectEvent>,
) {
    if let Some(mut task_res) = task_resource {
        if let Some(mut task) = task_res.task.take() {
            if let Some(result) = bevy::tasks::block_on(bevy::tasks::futures_lite::future::poll_once(&mut task)) {
                if let Some(file_handle) = result {
                    let path = file_handle.path().to_path_buf();
                    info!("Export file selected: {:?}", path);
                    export_events.send(ExportProjectEvent { path });
                } else {
                    info!("Export file selection cancelled");
                }
                commands.remove_resource::<ExportFileDialogTask>();
            } else {
                task_res.task = Some(task);
            }
        }
    }
}

fn encode_file_to_base64(file_path: &str) -> Result<String, Box<dyn std::error::Error>> {
    let file_data = fs::read(file_path)?;
    let encoded = general_purpose::STANDARD.encode(&file_data);
    Ok(encoded)
}

fn export_project_data(
    scene_data: &SceneData,
    light_groups: &LightGroups,
    timeline_state: &TimelineState,
    audio_state: &AudioState,
    light_query: &Query<(Entity, &MovingLight, &Transform), With<MovingLight>>,
    gltf_query: &Query<(&ImportedGltf, &Transform), With<ImportedGltf>>,
) -> QWETProject {
    let mut project = QWETProject::new();

    // ステージデータの収集
    for (imported_gltf, transform) in gltf_query.iter() {
        match encode_file_to_base64(&imported_gltf.path) {
            Ok(encoded_data) => {
                let model_data = GltfModelData {
                    data: encoded_data,
                    position: transform.translation,
                    rotation: transform.rotation,
                    scale: transform.scale,
                };
                project.stage.gltf_models.push(model_data);
            }
            Err(e) => {
                error!("Failed to encode GLB file {}: {}", imported_gltf.path, e);
                // エラーが発生してもプロジェクトのエクスポートを続行
            }
        }
    }

    // ライトデータの収集
    for (_entity, moving_light, transform) in light_query.iter() {
        let mut light_data = LightData::from(moving_light.clone());
        light_data.position = transform.translation;
        light_data.rotation = transform.rotation;
        light_data.scale = transform.scale;
        project.lights.push(light_data);
    }

    // タイムラインデータの収集
    project.timeline.total_time = timeline_state.total_time;
    for (group_name, group) in &light_groups.groups {
        let group_data = LightGroupData {
            color: [
                group.color.to_srgba().red,
                group.color.to_srgba().green,
                group.color.to_srgba().blue,
                group.color.to_srgba().alpha,
            ],
            keyframes: group.keyframes.iter().map(|kf| kf.clone().into()).collect(),
        };
        project.timeline.groups.insert(group_name.clone(), group_data);
    }

    // 音楽データの収集
    if let Some(ref audio_path) = audio_state.current_audio_path {
        match encode_file_to_base64(&audio_path.to_string_lossy()) {
            Ok(encoded_data) => {
                project.audio = Some(AudioData {
                    data: encoded_data,
                    total_duration: audio_state.total_duration,
                });
            }
            Err(e) => {
                error!("Failed to encode audio file {}: {}", audio_path.display(), e);
                // エラーが発生してもプロジェクトのエクスポートを続行
            }
        }
    }

    project
}

#[allow(clippy::too_many_arguments)]
fn export_project_to_file(
    mut export_events: EventReader<ExportProjectEvent>,
    mut export_state: ResMut<ExportState>,
    scene_data: Res<SceneData>,
    light_groups: Res<LightGroups>,
    timeline_state: Res<TimelineState>,
    audio_state: Res<AudioState>,
    light_query: Query<(Entity, &MovingLight, &Transform), With<MovingLight>>,
    gltf_query: Query<(&ImportedGltf, &Transform), With<ImportedGltf>>,
) {
    for event in export_events.read() {
        info!("Exporting project to: {:?}", event.path);
        export_state.export_status = Some("Exporting project...".to_string());

        // プロジェクトデータを収集
        let project = export_project_data(
            &scene_data,
            &light_groups,
            &timeline_state,
            &audio_state,
            &light_query,
            &gltf_query,
        );

        // 統計情報をログに出力
        info!("Export statistics:");
        info!("  - {} GLB models", project.stage.gltf_models.len());
        info!("  - {} lights", project.lights.len());
        info!("  - {} light groups", project.timeline.groups.len());
        if project.audio.is_some() {
            info!("  - Audio included");
        } else {
            info!("  - No audio");
        }

        // JSONとしてシリアライズ
        match serde_json::to_string_pretty(&project) {
            Ok(json_content) => {
                let content_size = json_content.len();
                info!("JSON content size: {} KB", content_size / 1024);
                
                // ファイルに書き込み
                match fs::write(&event.path, &json_content) {
                    Ok(_) => {
                        let success_msg = format!(
                            "Project exported successfully to {} ({} KB)", 
                            event.path.display(),
                            content_size / 1024
                        );
                        info!("{}", success_msg);
                        export_state.export_status = Some(success_msg);
                        export_state.last_export_path = Some(event.path.clone());
                    }
                    Err(e) => {
                        let error_msg = format!("Failed to write file: {}", e);
                        error!("{}", error_msg);
                        export_state.export_status = Some(error_msg);
                    }
                }
            }
            Err(e) => {
                let error_msg = format!("Failed to serialize project data: {}", e);
                error!("{}", error_msg);
                export_state.export_status = Some(error_msg);
            }
        }
    }
}

