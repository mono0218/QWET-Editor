use bevy::prelude::*;

pub struct MovingLightPlugin;

impl Plugin for MovingLightPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_event::<super::events::PlaceLightEvent>()
            .add_event::<super::events::AddLightEvent>()
            .add_systems(Update, (
                super::placement::moving_light_placement_ui,
                super::placement::handle_light_placement,
                super::placement::handle_add_light_event,
                super::controls::moving_light_controls,
                super::rendering::update_moving_light_mesh_transforms,
                super::selection_helper::ensure_moving_light_root_only_selectable,
            ));
    }
}
