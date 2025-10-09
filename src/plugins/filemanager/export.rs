use bevy::prelude::*;
use crate::{components::*, resources::*, export::*};
use crate::plugins::timeline_editor::{LightGroups, TimelineState};
use std::path::PathBuf;
use std::fs;
use base64::{Engine as _, engine::general_purpose};

// ==================== イベント定義 ====================

#[derive(Event)]
pub struct ExportProjectEvent {
    pub path: PathBuf,
}

// ==================== リソース定義 ====================

#[derive(Resource, Default)]
pub struct ExportState {
    pub export_trigger: bool,
    pub last_export_path: Option<PathBuf>,
    pub export_status: Option<String>,
}

#[derive(Resource)]
pub struct ExportFileDialogTask {
    pub task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}

#[derive(Resource)]
pub struct ExportProjectTask {
    pub task: Option<bevy::tasks::Task<PathBuf>>,
    pub processing: bool,
}

// ==================== プロジェクトエクスポート ====================

pub fn handle_export_project(
    mut export_events: EventReader<ExportProjectEvent>,
    mut commands: Commands,
) {
    for event in export_events.read() {
        // Check if this is a dialog trigger (empty path)
        if event.path.as_os_str().is_empty() {
            info!("Triggering export file dialog...");

            let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                rfd::AsyncFileDialog::new()
                    .add_filter("QWET Project", &["qwet"])
                    .set_file_name("project.qwet")
                    .save_file()
                    .await
            });

            commands.insert_resource(ExportFileDialogTask { task: Some(task) });
        } else {
            // Process the actual file export
            info!("Processing QWET project export to: {:?}", event.path);

            // Start async export task
            let path = event.path.clone();
            let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                path
            });

            commands.insert_resource(ExportProjectTask {
                task: Some(task),
                processing: false,
            });
        }
    }
}

pub fn poll_export_file_dialog(
    mut commands: Commands,
    task_resource: Option<ResMut<ExportFileDialogTask>>,
    mut export_events: EventWriter<ExportProjectEvent>,
) {
    if let Some(mut task_res) = task_resource {
        if let Some(mut task) = task_res.task.take() {
            if let Some(result) = bevy::tasks::block_on(bevy::tasks::poll_once(&mut task)) {
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
    _scene_data: &SceneData,
    light_groups: &LightGroups,
    timeline_state: &TimelineState,
    audio_state: &AudioState,
    light_query: &Query<(Entity, &MovingLight, &Transform), With<MovingLight>>,
    gltf_query: &Query<(&ImportedGltf, &Transform), With<ImportedGltf>>,
    barrier_query: &Query<(&BarrierMesh, &Transform), With<BarrierMesh>>,
) -> QWETProject {
    let mut project = QWETProject::new();

    // ステージとアバターデータの収集
    for (imported_gltf, transform) in gltf_query.iter() {
        match encode_file_to_base64(&imported_gltf.path.to_string_lossy()) {
            Ok(encoded_data) => {
                if imported_gltf.is_avatar {
                    // アバターデータとして追加
                    let avatar_data = AvatarData {
                        data: encoded_data,
                        position: transform.translation,
                        rotation: transform.rotation,
                        scale: transform.scale,
                    };
                    project.avatars.push(avatar_data);
                } else {
                    // ステージモデルとして追加
                    let model_data = GltfModelData {
                        data: encoded_data,
                        position: transform.translation,
                        rotation: transform.rotation,
                        scale: transform.scale,
                    };
                    project.stage.gltf_models.push(model_data);
                }
            }
            Err(e) => {
                error!("Failed to encode GLB file {}: {}", imported_gltf.path.display(), e);
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

    // バリアメッシュデータの収集
    for (barrier, transform) in barrier_query.iter() {
        let barrier_data = BarrierData {
            name: barrier.name.clone(),
            position: transform.translation,
            rotation: transform.rotation,
            size: barrier.size,
        };
        project.barriers.push(barrier_data);
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
pub fn export_project_to_file(
    mut export_events: EventReader<ExportProjectEvent>,
    mut export_state: ResMut<ExportState>,
    scene_data: Res<SceneData>,
    light_groups: Res<LightGroups>,
    timeline_state: Res<TimelineState>,
    audio_state: Res<AudioState>,
    light_query: Query<(Entity, &MovingLight, &Transform), With<MovingLight>>,
    gltf_query: Query<(&ImportedGltf, &Transform), With<ImportedGltf>>,
    barrier_query: Query<(&BarrierMesh, &Transform), With<BarrierMesh>>,
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
            &barrier_query,
        );

        // 統計情報をログに出力
        info!("Export statistics:");
        info!("  - {} GLB models", project.stage.gltf_models.len());
        info!("  - {} lights", project.lights.len());
        info!("  - {} barriers", project.barriers.len());
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
