use bevy::prelude::*;
use super::types::TimelineTrack;

#[derive(Event)]
pub struct CreateGroupEvent {
    pub name: String,
}

#[derive(Event)]
pub struct AddLightToGroupEvent {
    pub group_name: String,
    pub light_entity: Entity,
}

#[derive(Event)]
pub struct CreateKeyframeEvent {
    pub group_name: String,
    pub time: f32,
    pub track: TimelineTrack,
    pub value: f32,
    pub rgb_values: Option<(f32, f32, f32)>, // For RGB track: (red, green, blue)
}

#[derive(Event)]
pub struct DeleteKeyframeEvent {
    pub group_name: String,
    pub keyframe_index: usize,
}

#[derive(Event)]
pub struct EditKeyframeEvent {
    pub group_name: String,
    pub keyframe_index: usize,
}
