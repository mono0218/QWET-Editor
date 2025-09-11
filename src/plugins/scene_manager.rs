use bevy::prelude::*;
use bevy_egui::EguiContexts;
use crate::{components::*, resources::*};
use std::path::PathBuf;

pub struct SceneManagerPlugin;

impl Plugin for SceneManagerPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_event::<SaveSceneEvent>()
            .add_event::<LoadSceneEvent>()
            .add_event::<NewSceneEvent>()
            .add_systems(Update, (
                scene_manager_ui,
                handle_save_scene,
                handle_load_scene,
                handle_new_scene,
            ));
    }
}

#[derive(Event)]
pub struct SaveSceneEvent {
    pub path: PathBuf,
}

#[derive(Event)]
pub struct LoadSceneEvent {
    pub path: PathBuf,
}

#[derive(Event)]
pub struct NewSceneEvent;

fn scene_manager_ui(
    _contexts: EguiContexts,
    _editor_state: Res<EditorState>,
    _save_events: EventWriter<SaveSceneEvent>,
    _load_events: EventWriter<LoadSceneEvent>,
    _new_events: EventWriter<NewSceneEvent>,
) {
    // This function will be called from the editor UI
    // For now, we'll handle the events from the menu
}

fn handle_save_scene(
    mut save_events: EventReader<SaveSceneEvent>,
    scene_data: Res<SceneData>,
) {
    for event in save_events.read() {
        let scene_json = match serde_json::to_string_pretty(&*scene_data) {
            Ok(json) => json,
            Err(e) => {
                error!("Failed to serialize scene data: {}", e);
                continue;
            }
        };

        if let Err(e) = std::fs::write(&event.path, scene_json) {
            error!("Failed to write scene file {:?}: {}", event.path, e);
        } else {
            info!("Scene saved to {:?}", event.path);
        }
    }
}

fn handle_load_scene(
    mut load_events: EventReader<LoadSceneEvent>,
    mut scene_data: ResMut<SceneData>,
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    existing_models: Query<Entity, With<ImportedGltf>>,
) {
    for event in load_events.read() {
        let scene_json = match std::fs::read_to_string(&event.path) {
            Ok(content) => content,
            Err(e) => {
                error!("Failed to read scene file {:?}: {}", event.path, e);
                continue;
            }
        };

        let loaded_scene: SceneData = match serde_json::from_str(&scene_json) {
            Ok(data) => data,
            Err(e) => {
                error!("Failed to deserialize scene data: {}", e);
                continue;
            }
        };

        // Clear existing scene objects
        for entity in existing_models.iter() {
            commands.entity(entity).despawn_recursive();
        }


        // Load imported models
        for model_path in &loaded_scene.imported_models {
            let scene_handle: Handle<Scene> = asset_server.load(&format!("{}#Scene0", model_path));
            commands.spawn((
                SceneRoot(scene_handle),
                Transform::from_translation(Vec3::ZERO),
                ImportedGltf {
                    path: model_path.clone(),
                },
                Name::new("Imported Model"),
            ));
        }

        // Update scene data
        *scene_data = loaded_scene;
        info!("Scene loaded from {:?}", event.path);
    }
}

fn handle_new_scene(
    mut new_events: EventReader<NewSceneEvent>,
    mut scene_data: ResMut<SceneData>,
    mut editor_state: ResMut<EditorState>,
    mut commands: Commands,
    existing_models: Query<Entity, With<ImportedGltf>>,
) {
    for _event in new_events.read() {
        // Clear existing scene objects
        for entity in existing_models.iter() {
            commands.entity(entity).despawn_recursive();
        }

        // Reset scene data
        *scene_data = SceneData::default();
        editor_state.selected_entity = None;
        
        info!("New scene created");
    }
}