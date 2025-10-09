use bevy::prelude::*;
use crate::{components::*, resources::*, export::*};
use std::path::PathBuf;
use std::fs;

// ==================== イベント定義 ====================

#[derive(Event)]
pub struct ImportGltfEvent {
    pub path: PathBuf,
}

#[derive(Event)]
pub struct ImportAvatarEvent {
    pub path: PathBuf,
}

#[derive(Event)]
pub struct ImportProjectEvent {
    pub file_path: PathBuf,
}

// ==================== リソース定義 ====================

#[derive(Resource)]
pub struct ImportFileDialogTask {
    pub task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}

#[derive(Resource)]
pub struct ImportProjectTask {
    pub task: Option<bevy::tasks::Task<QWETProject>>,
    pub processing: bool,
}

#[derive(Resource, Default)]
pub struct ImportState {
    pub url_input: String,
    pub last_import_url: Option<String>,
    pub import_status: Option<String>,
}

// ==================== GLTFインポート ====================

pub fn process_gltf_import(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut import_events: EventReader<ImportGltfEvent>,
    mut scene_data: ResMut<SceneData>,
) {
    for event in import_events.read() {
        let file_path = event.path.to_string_lossy();
        info!("Processing GLB import: {}", file_path);

        let gltf_handle: Handle<Gltf> = asset_server.load(file_path.to_string());
        let scene_handle: Handle<Scene> = asset_server.load(
            GltfAssetLabel::Scene(0).from_asset(file_path.to_string())
        );

        commands.spawn((
            SceneRoot(scene_handle),
            Transform::from_translation(Vec3::ZERO),
            ImportedGltf {
                name: event.path.file_stem()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string(),
                path: event.path.clone(),
                handle: gltf_handle,
                is_avatar: false,
            },
            Name::new("Imported Model"),
            Selectable,
        ));

        scene_data.imported_models.push(file_path.to_string());

        info!("Successfully imported GLB: {}", file_path);
    }
}

pub fn ensure_gltf_root_only_selectable(
    mut commands: Commands,
    imported_gltf_query: Query<Entity, (With<ImportedGltf>, With<Selectable>)>,
    children_query: Query<&Children>,
    child_selectable_query: Query<Entity, (With<Selectable>, Without<ImportedGltf>)>,
) {
    for gltf_entity in imported_gltf_query.iter() {
        if let Ok(children) = children_query.get(gltf_entity) {
            for &child in children.iter() {
                remove_selectable_recursive(&mut commands, child, &children_query, &child_selectable_query);
            }
        }
    }
}

fn remove_selectable_recursive(
    commands: &mut Commands,
    entity: Entity,
    children_query: &Query<&Children>,
    child_selectable_query: &Query<Entity, (With<Selectable>, Without<ImportedGltf>)>,
) {
    if child_selectable_query.get(entity).is_ok() {
        commands.entity(entity).remove::<Selectable>();
    }

    if let Ok(children) = children_query.get(entity) {
        for &child in children.iter() {
            remove_selectable_recursive(commands, child, children_query, child_selectable_query);
        }
    }
}

// ==================== アバターインポート ====================

pub fn process_avatar_import(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut import_events: EventReader<ImportAvatarEvent>,
    mut scene_data: ResMut<SceneData>,
) {
    for event in import_events.read() {
        let file_path = event.path.to_string_lossy();
        info!("Processing Avatar import: {}", file_path);

        let gltf_handle: Handle<Gltf> = asset_server.load(file_path.to_string());
        let scene_handle: Handle<Scene> = asset_server.load(
            GltfAssetLabel::Scene(0).from_asset(file_path.to_string())
        );

        let avatar_name = event.path.file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string() + " (Avatar)";

        // エンティティをスポーンして画面に表示
        commands.spawn((
            SceneRoot(scene_handle),
            Transform::from_translation(Vec3::new(0.0, 0.0, 0.0)),
            ImportedGltf {
                name: avatar_name.clone(),
                path: event.path.clone(),
                handle: gltf_handle.clone(),
                is_avatar: true,
            },
            Name::new("Avatar"),
            Selectable,
        ));

        scene_data.imported_gltfs.push(ImportedGltf {
            name: avatar_name,
            path: event.path.clone(),
            handle: gltf_handle,
            is_avatar: true,
        });
        scene_data.imported_models.push(file_path.to_string());

        info!("Avatar GLB loaded and spawned: {}", file_path);
    }
}

// ==================== プロジェクトインポート ====================

pub fn import_project_from_file(
    mut commands: Commands,
    mut import_events: EventReader<ImportProjectEvent>,
) {
    for event in import_events.read() {
        // Check if this is a dialog trigger (empty path)
        if event.file_path.as_os_str().is_empty() {
            info!("Triggering project import file dialog...");

            let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                rfd::AsyncFileDialog::new()
                    .add_filter("QWET Project", &["qwet"])
                    .set_title("Select QWET Project")
                    .pick_file()
                    .await
            });

            commands.insert_resource(ImportFileDialogTask { task: Some(task) });
        } else {
            // Process the actual file import
            let file_path = event.file_path.to_string_lossy();
            info!("Processing QWET project import: {}", file_path);

            // Read and process the .qwet file
            match fs::read_to_string(&event.file_path) {
                Ok(content) => {
                    match serde_json::from_str::<QWETProject>(&content) {
                        Ok(project) => {
                            info!("Successfully parsed QWET project");
                            // Start async processing of the project data
                            let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                                project
                            });

                            commands.insert_resource(ImportProjectTask {
                                task: Some(task),
                                processing: false,
                            });
                        }
                        Err(e) => {
                            error!("Failed to parse QWET project: {}", e);
                        }
                    }
                }
                Err(e) => {
                    error!("Failed to read QWET project file: {}", e);
                }
            }
        }
    }
}

pub fn poll_import_file_dialog(
    mut commands: Commands,
    task_resource: Option<ResMut<ImportFileDialogTask>>,
    mut import_events: EventWriter<ImportProjectEvent>,
) {
    if let Some(mut task_res) = task_resource {
        if let Some(mut task) = task_res.task.take() {
            if let Some(result) = bevy::tasks::block_on(bevy::tasks::poll_once(&mut task)) {
                if let Some(file_handle) = result {
                    let path = file_handle.path().to_path_buf();
                    info!("Project file selected: {:?}", path);
                    import_events.send(ImportProjectEvent { file_path: path });
                } else {
                    info!("Project file selection cancelled");
                }
                commands.remove_resource::<ImportFileDialogTask>();
            } else {
                task_res.task = Some(task);
            }
        }
    }
}
