use bevy::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Component, Serialize, Deserialize, Clone, Debug)]
pub struct MovingLight {
    pub name: String,
    pub light_type: MovingLightType,
    pub intensity: f32,
    pub color: Color,
    pub pan: f32,
    pub tilt: f32,
    pub beam_angle: f32,
    pub group_id: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum MovingLightType {
    Spot,
    Wash,
    Beam,
}

impl Default for MovingLight {
    fn default() -> Self {
        Self {
            name: "Moving Light".to_string(),
            light_type: MovingLightType::Spot,
            intensity: 1.0,
            color: Color::WHITE,
            pan: 0.0,
            tilt: 0.0,
            beam_angle: 30.0,
            group_id: None,
        }
    }
}


#[derive(Component)]
pub struct Selected;

#[derive(Component)]
pub struct Selectable;

#[derive(Component)]
pub struct ImportedGltf {
    pub path: String,
}

