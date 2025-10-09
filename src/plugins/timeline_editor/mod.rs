pub mod plugin;
pub mod types;
pub mod events;
pub mod ui;
pub mod handlers;
pub mod playback;

pub use plugin::TimelineEditorPlugin;
pub use types::{LightGroups, LightGroup, LightKeyframe, TimelineState, TimelineTrack};
pub use events::*;
