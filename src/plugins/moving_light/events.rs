use bevy::prelude::*;

#[derive(Event)]
pub struct PlaceLightEvent {
    pub position: Vec3,
}

#[derive(Event)]
pub struct AddLightEvent;
