use bevy::prelude::*;

pub struct AudioPlayerPlugin;

impl Plugin for AudioPlayerPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<crate::resources::AudioState>()
            .add_event::<super::events::LoadAudioEvent>()
            .add_event::<super::events::PlayAudioEvent>()
            .add_event::<super::events::StopAudioEvent>()
            .add_systems(Startup, super::init::initialize_rodio)
            .add_systems(Update, (
                super::ui::audio_player_ui,
                super::handlers::handle_load_audio_event,
                super::handlers::handle_play_audio_event,
                super::handlers::handle_stop_audio_event,
                super::handlers::poll_audio_file_dialog,
            ));
    }
}
