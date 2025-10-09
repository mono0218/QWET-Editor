use bevy::prelude::*;
use super::types::*;
use super::events::*;

pub struct TimelineEditorPlugin;

impl Plugin for TimelineEditorPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<LightGroups>()
            .init_resource::<TimelineState>()
            .add_event::<CreateGroupEvent>()
            .add_event::<AddLightToGroupEvent>()
            .add_event::<CreateKeyframeEvent>()
            .add_event::<DeleteKeyframeEvent>()
            .add_event::<EditKeyframeEvent>()
            .add_systems(Update, (
                super::ui::timeline_ui,
                super::handlers::handle_group_creation,
                super::handlers::handle_light_grouping,
                super::handlers::handle_keyframe_creation,
                super::handlers::handle_keyframe_deletion,
                super::handlers::handle_keyframe_editing,
                super::playback::update_timeline_playback,
                super::playback::update_light_animation,
                super::playback::sync_lights_to_groups,
            ));
    }
}
