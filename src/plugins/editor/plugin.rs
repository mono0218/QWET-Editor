use bevy::prelude::*;

pub struct EditorPlugin;

#[derive(Component)]
pub struct EditorCamera;

impl Plugin for EditorPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<crate::resources::EditorState>()
            .init_resource::<crate::resources::SceneData>()
            .add_systems(Startup, super::scene::setup_scene)
            .add_systems(Update, (
                super::camera::camera_controller,
                super::ui::editor_ui,
                super::ui::toggle_bloom_system,
                super::ui::poll_gltf_file_dialog,
                super::ui::poll_avatar_file_dialog,
            ));
    }
}
