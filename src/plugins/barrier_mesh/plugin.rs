use bevy::prelude::*;

pub struct BarrierMeshPlugin;

impl Plugin for BarrierMeshPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_event::<super::events::AddBarrierEvent>()
            .add_systems(Update, (
                super::spawning::handle_add_barrier,
                super::rendering::update_barrier_visibility,
                super::rendering::update_barrier_mesh,
                super::debug::debug_barrier_transform,
            ));
    }
}
