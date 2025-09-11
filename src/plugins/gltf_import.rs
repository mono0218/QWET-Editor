use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*};
use std::path::PathBuf;

pub struct GltfImportPlugin;

impl Plugin for GltfImportPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<GltfImportState>()
            .add_event::<ImportGltfEvent>()
            .add_systems(Update, (
                gltf_import_ui,
                handle_gltf_import,
                process_import_requests,
                poll_file_dialog,
                ensure_gltf_root_only_selectable,
            ));
    }
}

#[derive(Event)]
pub struct ImportGltfEvent {
    pub path: PathBuf,
}

#[derive(Resource, Default)]
struct GltfImportState {
    import_trigger: bool,
}

fn gltf_import_ui(
    mut contexts: EguiContexts,
    mut import_state: ResMut<GltfImportState>,
) {
    let ctx = contexts.ctx_mut();
    
    // Listen for import GLB menu clicks
    ctx.input(|i| {
        if i.key_pressed(egui::Key::I) && i.modifiers.ctrl {
            import_state.import_trigger = true;
        }
    });
    
    // Trigger file dialog when Import GLB is clicked from menu
    if import_state.import_trigger {
        import_state.import_trigger = false;
        info!("Opening GLB file dialog...");
        // This will be handled by the async task system
    }
}

fn handle_gltf_import(
    mut import_state: ResMut<GltfImportState>,
    mut import_events: EventWriter<ImportGltfEvent>,
) {
    if import_state.import_trigger {
        import_state.import_trigger = false;
        
        // Open file dialog in a non-blocking way
        if let Some(path) = rfd::FileDialog::new()
            .add_filter("3D Models", &["glb", "gltf"])
            .set_directory("./assets")
            .pick_file()
        {
            info!("Selected file: {:?}", path);
            import_events.send(ImportGltfEvent { path });
        } else {
            info!("File selection cancelled");
        }
    }
}

fn process_import_requests(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut import_events: EventReader<ImportGltfEvent>,
    mut scene_data: ResMut<SceneData>,
) {
    for event in import_events.read() {
        if event.path.as_os_str().is_empty() {
            // Empty path means we need to show file dialog
            info!("Triggering file dialog...");
            
            // Spawn async task to avoid blocking
            let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                rfd::AsyncFileDialog::new()
                    .add_filter("3D Models", &["glb", "gltf"])
                    .set_directory("./assets")
                    .pick_file()
                    .await
            });
            
            // Store task for later polling
            commands.insert_resource(FileDialogTask { task: Some(task) });
        } else {
            let file_path = event.path.to_string_lossy();
            info!("Processing GLB import: {}", file_path);
            
            let scene_handle: Handle<Scene> = asset_server.load(
                GltfAssetLabel::Scene(0).from_asset(file_path.to_string())
            );

            // Spawn the scene
            commands.spawn((
                SceneRoot(scene_handle),
                Transform::from_translation(Vec3::ZERO),
                ImportedGltf {
                    path: file_path.to_string(),
                },
                Name::new("Imported Model"),
                crate::components::Selectable,
            ));
            
            // Add to scene data
            scene_data.imported_models.push(file_path.to_string());
            
            info!("Successfully imported GLB: {}", file_path);
        }
    }
}

#[derive(Resource)]
struct FileDialogTask {
    task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}

fn poll_file_dialog(
    mut commands: Commands,
    task_res: Option<ResMut<FileDialogTask>>,
    mut import_events: EventWriter<ImportGltfEvent>,
) {
    if let Some(mut task_resource) = task_res {
        if let Some(task) = &mut task_resource.task {
            if let Some(result) = bevy::tasks::block_on(futures_lite::future::poll_once(task)) {
                // Task completed
                if let Some(file_handle) = result {
                    let path = file_handle.path().to_path_buf();
                    info!("File selected: {:?}", path);
                    import_events.send(ImportGltfEvent { path });
                } else {
                    info!("File selection cancelled");
                }
                
                // Remove task
                task_resource.task = None;
                commands.remove_resource::<FileDialogTask>();
            }
        }
    }
}

fn ensure_gltf_root_only_selectable(
    mut commands: Commands,
    imported_gltf_query: Query<Entity, (With<crate::components::ImportedGltf>, With<crate::components::Selectable>)>,
    children_query: Query<&Children>,
    child_selectable_query: Query<Entity, (With<crate::components::Selectable>, Without<crate::components::ImportedGltf>)>,
) {
    // Remove Selectable component from children of ImportedGltf entities
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
    child_selectable_query: &Query<Entity, (With<crate::components::Selectable>, Without<crate::components::ImportedGltf>)>,
) {
    // Remove Selectable from this entity if it has it (but is not an ImportedGltf root)
    if child_selectable_query.get(entity).is_ok() {
        commands.entity(entity).remove::<crate::components::Selectable>();
    }
    
    // Recursively remove from children
    if let Ok(children) = children_query.get(entity) {
        for &child in children.iter() {
            remove_selectable_recursive(commands, child, children_query, child_selectable_query);
        }
    }
}