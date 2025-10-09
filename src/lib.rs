mod plugins;
mod components;
mod resources;
mod systems;
mod export;

use bevy::prelude::*;
use bevy_egui::EguiPlugin;
use plugins::*;

// パブリックエクスポート
pub use components::*;
pub use resources::*;
pub use plugins::editor::EditorCamera;
pub use plugins::timeline_editor::TimelineState;

/// QWETエディターのメインアプリケーション初期化
pub fn init_app() -> App {
    let mut app = App::new();

    app.add_plugins((
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
        SceneManagerPlugin,
        TimelineEditorPlugin,
        MovingLightPlugin,
        AudioPlayerPlugin,
        FileManagerPlugin,
        BarrierMeshPlugin,
    ));

    app
}
