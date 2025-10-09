use bevy::prelude::*;
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

fn handle_save_scene(
    mut save_events: EventReader<SaveSceneEvent>,
    scene_data: Res<SceneData>,
) {
    for event in save_events.read() {
        let lights_data = &scene_data.lights;
        let scene_json = match serde_json::to_string_pretty(lights_data) {
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

        let lights_data: Vec<(Transform, crate::components::MovingLight)> = match serde_json::from_str(&scene_json) {
            Ok(data) => data,
            Err(e) => {
                error!("Failed to deserialize scene data: {}", e);
                continue;
            }
        };

        for entity in existing_models.iter() {
            commands.entity(entity).despawn_recursive();
        }

        scene_data.lights = lights_data;
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
        for entity in existing_models.iter() {
            commands.entity(entity).despawn_recursive();
        }

        *scene_data = SceneData::default();
        editor_state.selected_entity = None;

        info!("New scene created");
    }
}
