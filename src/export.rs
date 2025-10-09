use bevy::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct QWETProject {
    pub version: String,
    pub stage: StageData,
    pub avatars: Vec<AvatarData>,
    pub lights: Vec<LightData>,
    pub barriers: Vec<BarrierData>,
    pub timeline: TimelineData,
    pub audio: Option<AudioData>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StageData {
    pub gltf_models: Vec<GltfModelData>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GltfModelData {
    pub data: String, // base64エンコードされたGLBデータ
    pub position: Vec3,
    pub rotation: Quat,
    pub scale: Vec3,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AvatarData {
    pub data: String, // base64エンコードされたGLBデータ
    pub position: Vec3,
    pub rotation: Quat,
    pub scale: Vec3,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LightData {
    pub name: String,
    pub light_type: crate::components::MovingLightType,
    pub position: Vec3,
    pub rotation: Quat,
    pub scale: Vec3,
    pub intensity: f32,
    pub color: [f32; 4], // RGBA
    pub pan: f32,
    pub tilt: f32,
    pub beam_angle: f32,
    pub group_id: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TimelineData {
    pub groups: HashMap<String, LightGroupData>,
    pub total_time: f32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LightGroupData {
    pub color: [f32; 4], // RGBA
    pub keyframes: Vec<LightKeyframeData>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LightKeyframeData {
    pub time: f32,
    pub pan: Option<f32>,
    pub tilt: Option<f32>,
    pub red: Option<f32>,
    pub green: Option<f32>,
    pub blue: Option<f32>,
    pub intensity: Option<f32>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AudioData {
    pub data: String, // base64エンコードされた音楽データ
    pub total_duration: f32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BarrierData {
    pub name: String,
    pub position: Vec3,
    pub rotation: Quat,
    pub size: Vec3,
}

impl QWETProject {
    pub fn new() -> Self {
        Self {
            version: "1.0.0".to_string(),
            stage: StageData {
                gltf_models: Vec::new(),
            },
            avatars: Vec::new(),
            lights: Vec::new(),
            barriers: Vec::new(),
            timeline: TimelineData {
                groups: HashMap::new(),
                total_time: 30.0,
            },
            audio: None,
        }
    }
}

impl From<crate::components::MovingLight> for LightData {
    fn from(light: crate::components::MovingLight) -> Self {
        Self {
            name: light.name,
            light_type: light.light_type,
            position: Vec3::ZERO,
            rotation: Quat::IDENTITY,
            scale: Vec3::ONE,
            intensity: light.intensity,
            color: [
                light.color.to_srgba().red,
                light.color.to_srgba().green,
                light.color.to_srgba().blue,
                light.color.to_srgba().alpha,
            ],
            pan: light.pan,
            tilt: light.tilt,
            beam_angle: light.beam_angle,
            group_id: light.group_id,
        }
    }
}

impl From<crate::plugins::timeline_editor::LightKeyframe> for LightKeyframeData {
    fn from(keyframe: crate::plugins::timeline_editor::LightKeyframe) -> Self {
        Self {
            time: keyframe.time,
            pan: keyframe.pan,
            tilt: keyframe.tilt,
            red: keyframe.red,
            green: keyframe.green,
            blue: keyframe.blue,
            intensity: keyframe.intensity,
        }
    }
}