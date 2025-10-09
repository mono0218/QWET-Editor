use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::resources::*;
use super::events::*;
use std::path::PathBuf;

pub fn audio_player_ui(
    mut contexts: EguiContexts,
    mut audio_state: ResMut<AudioState>,
    mut load_events: EventWriter<LoadAudioEvent>,
    mut play_events: EventWriter<PlayAudioEvent>,
    mut stop_events: EventWriter<StopAudioEvent>,
) {
    let ctx = contexts.ctx_mut();

    egui::Window::new("🎵 Audio Player")
        .default_width(400.0)
        .resizable(true)
        .show(ctx, |ui| {
            ui.heading("Music Control");
            
            // ファイル読み込み
            ui.horizontal(|ui| {
                if ui.button("📁 Load Audio").clicked() {
                    info!("Load Audio button clicked");
                    // 空のパスでLoadAudioEventを送信（非同期ダイアログのトリガー）
                    load_events.send(LoadAudioEvent { path: PathBuf::new() });
                }
                
                if let Some(ref path) = audio_state.current_audio_path {
                    ui.label(format!("🎵 {}", path.file_name().unwrap_or_default().to_string_lossy()));
                } else {
                    ui.label("No audio loaded");
                }
            });
            
            ui.separator();
            
            // 再生制御
            ui.horizontal(|ui| {
                if ui.button(if audio_state.is_playing { "⏸ Pause" } else { "▶ Play" }).clicked() {
                    if audio_state.is_playing {
                        stop_events.send(StopAudioEvent);
                    } else {
                        play_events.send(PlayAudioEvent);
                    }
                }
                
                if ui.button("⏹ Stop").clicked() {
                    stop_events.send(StopAudioEvent);
                    // current_timeはリセットしない（一時停止として動作）
                }
                
                if ui.button("⏮ Reset").clicked() {
                    stop_events.send(StopAudioEvent);
                    audio_state.current_time = 0.0;
                }
            });
            
            // 音量制御
            ui.horizontal(|ui| {
                ui.label("🔊 Volume:");
                ui.add(egui::Slider::new(&mut audio_state.volume, 0.0..=1.0).suffix("x"));
            });
            
            // 再生時間表示
            ui.horizontal(|ui| {
                ui.label("⏱ Time:");
                ui.label(format!("{:.1}s / {:.1}s", audio_state.current_time, audio_state.total_duration));
            });
            
            // プログレスバー
            if audio_state.total_duration > 0.0 {
                let progress = audio_state.current_time / audio_state.total_duration;
                ui.add(egui::ProgressBar::new(progress).show_percentage());
            }
            
            ui.separator();
            
            // タイムライン同期設定
            ui.checkbox(&mut audio_state.timeline_sync, "🔗 Sync with Timeline");
            
            if audio_state.timeline_sync {
                ui.label("Music will play/stop with timeline");
            }
            
            // エラーメッセージ表示
            if let Some(ref error) = audio_state.last_error {
                ui.separator();
                ui.colored_label(egui::Color32::RED, format!("❌ Error: {}", error));
                
                if ui.button("Clear Error").clicked() {
                    audio_state.last_error = None;
                }
            }
        });
}

