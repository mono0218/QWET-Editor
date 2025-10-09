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

#[derive(Component, Clone)]
pub struct ImportedGltf {
    pub name: String,
    pub path: std::path::PathBuf,
    pub handle: Handle<Gltf>,
    pub is_avatar: bool,
}

#[derive(Component)]
pub struct Avatar;

#[derive(Component, Clone, Debug)]
pub struct BarrierMesh {
    pub name: String,
    pub size: Vec3, // width, height, depth
    pub color: Color,
    pub visible: bool,
}

impl Default for BarrierMesh {
    fn default() -> Self {
        Self {
            name: "Barrier".to_string(),
            size: Vec3::new(2.0, 2.0, 0.1),
            color: Color::srgba(1.0, 0.0, 0.0, 0.3),
            visible: true,
        }
    }
}

