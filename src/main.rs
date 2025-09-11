use bevy::prelude::*;
use bevy_egui::EguiPlugin;

mod plugins;
mod components;
mod resources;
mod systems;

use plugins::*;

fn main() {
    App::new()
        .add_plugins((
            DefaultPlugins.set(WindowPlugin {
                primary_window: Some(Window {
                    title: "QWET Live Space Editor".to_string(),
                    resolution: (1280., 720.).into(),
                    ..default()
                }),
                ..default()
            }),
            EguiPlugin,
            EditorPlugin,
            SelectionPlugin,
            GltfImportPlugin,
            SceneManagerPlugin,
            TimelineEditorPlugin,
            MovingLightPlugin,
        ))
        .run();
}
