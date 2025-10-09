use bevy::prelude::*;

pub struct SelectionPlugin;

impl Plugin for SelectionPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_systems(Update, (
                super::picking::object_selection,
                super::properties::show_selected_properties,
                super::gizmos::draw_selection_gizmos,
                super::dragging::object_dragging,
            ));
    }
}
