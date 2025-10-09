use bevy::prelude::*;
use std::path::PathBuf;

#[derive(Event)]
pub struct LoadAudioEvent {
    pub path: PathBuf,
}

#[derive(Event)]
pub struct PlayAudioEvent;

#[derive(Event)]
pub struct StopAudioEvent;

#[derive(Resource)]
pub struct AudioFileDialogTask {
    pub task: Option<bevy::tasks::Task<Option<rfd::FileHandle>>>,
}
