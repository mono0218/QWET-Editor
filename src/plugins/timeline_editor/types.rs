use bevy::prelude::*;
use std::collections::HashMap;

#[derive(Resource, Default)]
pub struct LightGroups {
    pub groups: HashMap<String, LightGroup>,
}

#[derive(Clone)]
pub struct LightGroup {
    pub lights: Vec<Entity>,
    pub color: Color,
    pub keyframes: Vec<LightKeyframe>,
}

#[derive(Clone)]
pub struct LightKeyframe {
    pub time: f32,
    pub pan: Option<f32>,
    pub tilt: Option<f32>,
    pub red: Option<f32>,
    pub green: Option<f32>,
    pub blue: Option<f32>,
    pub intensity: Option<f32>,
}

#[derive(Clone, Debug, PartialEq)]
pub enum TimelineTrack {
    Pan,
    Tilt,
    RGB,
    Intensity,
}

#[derive(Resource)]
pub struct TimelineState {
    pub current_time: f32,
    pub total_time: f32,
    pub is_playing: bool,
    pub zoom: f32,
    pub panel_height: f32,
    pub selected_group: Option<String>,
    pub editing_keyframe: Option<(String, usize)>, // (group_name, keyframe_index)
}

impl Default for TimelineState {
    fn default() -> Self {
        Self {
            current_time: 0.0,
            total_time: 30.0,
            is_playing: false,
            zoom: 1.0,
            panel_height: 300.0,
            selected_group: None,
            editing_keyframe: None,
        }
    }
}
