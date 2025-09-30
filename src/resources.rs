use bevy::prelude::*;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

#[derive(Resource)]
pub struct EditorState {
    pub selected_entity: Option<Entity>,
    pub tool_mode: ToolMode,
    pub show_gizmo: bool,
    pub is_dragging: bool,
    pub drag_start_pos: Option<Vec2>,
    pub drag_offset: Vec3,
    pub show_properties: bool,
    pub bloom_enabled: bool,
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
            bloom_enabled: true,
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

#[derive(Resource)]
pub struct AudioState {
    pub current_audio_path: Option<PathBuf>,
    pub is_playing: bool,
    pub volume: f32,
    pub current_time: f32,
    pub total_duration: f32,
    pub timeline_sync: bool,
    pub last_error: Option<String>,
    pub rodio_sink: Option<Arc<Mutex<rodio::Sink>>>,
}


impl Default for AudioState {
    fn default() -> Self {
        Self {
            current_audio_path: None,
            is_playing: false,
            volume: 1.0,
            current_time: 0.0,
            total_duration: 0.0,
            timeline_sync: true,
            last_error: None,
            rodio_sink: None,
        }
    }
}

impl AudioState {
    pub fn new() -> Self {
        Self {
            current_audio_path: None,
            is_playing: false,
            volume: 1.0,
            current_time: 0.0,
            total_duration: 0.0,
            timeline_sync: true,
            last_error: None,
            rodio_sink: None,
        }
    }
}

