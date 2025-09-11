use bevy::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Resource)]
pub struct EditorState {
    pub selected_entity: Option<Entity>,
    pub tool_mode: ToolMode,
    pub show_gizmo: bool,
    pub is_dragging: bool,
    pub drag_start_pos: Option<Vec2>,
    pub drag_offset: Vec3,
    pub show_properties: bool,
}

impl Default for EditorState {
    fn default() -> Self {
        Self {
            selected_entity: None,
            tool_mode: ToolMode::default(),
            show_gizmo: true,
            is_dragging: false,
            drag_start_pos: None,
            drag_offset: Vec3::ZERO,
            show_properties: true,
        }
    }
}

#[derive(Default, Clone)]
pub enum ToolMode {
    #[default]
    Select,
    Animation,
}

#[derive(Resource, Default, Serialize, Deserialize)]
pub struct SceneData {
    pub lights: Vec<(Transform, crate::components::MovingLight)>,
    pub imported_models: Vec<String>,
}

