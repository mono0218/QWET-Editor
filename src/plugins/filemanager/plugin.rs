use bevy::prelude::*;

pub struct FileManagerPlugin;

impl Plugin for FileManagerPlugin {
    fn build(&self, app: &mut App) {
        app
            // リソース初期化
            .init_resource::<super::import::ImportState>()
            .init_resource::<super::export::ExportState>()
            // イベント登録
            .add_event::<super::import::ImportGltfEvent>()
            .add_event::<super::import::ImportAvatarEvent>()
            .add_event::<super::import::ImportProjectEvent>()
            .add_event::<super::export::ExportProjectEvent>()
            // システム登録
            .add_systems(Update, (
                // GLTFインポート
                super::import::process_gltf_import,
                super::import::ensure_gltf_root_only_selectable,
                // アバターインポート
                super::import::process_avatar_import,
                // プロジェクトインポート
                super::import::import_project_from_file,
                super::import::poll_import_file_dialog,
                // プロジェクトエクスポート
                super::export::handle_export_project,
                super::export::poll_export_file_dialog,
                super::export::export_project_to_file,
            ));
    }
}
