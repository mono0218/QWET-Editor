use bevy::prelude::*;
use crate::resources::*;
use crate::plugins::timeline_editor::TimelineState;
use super::events::*;
use super::init::*;
use std::fs::File;
use std::io::BufReader;
use std::sync::{Arc, Mutex};

pub fn handle_load_audio_event(
    mut load_events: EventReader<LoadAudioEvent>,
    mut audio_state: ResMut<AudioState>,
    mut commands: Commands,
) {
    for event in load_events.read() {
        if event.path.as_os_str().is_empty() {
            // 空のパスの場合は非同期ファイルダイアログを開始
            info!("Triggering audio file dialog...");
            
            let task = bevy::tasks::AsyncComputeTaskPool::get().spawn(async move {
                rfd::AsyncFileDialog::new()
                    .add_filter("Audio Files", &["wav", "mp3", "ogg", "flac"])
                    .pick_file()
                    .await
            });
            
            commands.insert_resource(AudioFileDialogTask { task: Some(task) });
        } else {
            // 実際のファイルパスが指定された場合
            info!("Loading audio file: {:?}", event.path);
            
            audio_state.current_audio_path = Some(event.path.clone());
            audio_state.current_time = 0.0;
            audio_state.is_playing = false;
            
            // 音楽ファイルの長さを取得（デフォルトは2分）
            audio_state.total_duration = get_audio_duration(&event.path).unwrap_or(120.0);
            
            info!("Audio file loaded: {:?}, duration: {:.1}s", event.path.file_name(), audio_state.total_duration);
        }
    }
}

pub fn handle_play_audio_event(
    mut play_events: EventReader<PlayAudioEvent>,
    mut audio_state: ResMut<AudioState>,
) {
    for _event in play_events.read() {
        if let Some(path) = audio_state.current_audio_path.clone() {
            // エラーをクリア
            audio_state.last_error = None;
            
            // ファイルが存在し、読み込み可能かチェック
            if !path.exists() {
                let error_msg = format!("Audio file does not exist: {:?}", path.file_name().unwrap_or_default());
                error!("{}", error_msg);
                audio_state.last_error = Some(error_msg);
                continue;
            }
            
            // Rodio OutputStreamとHandleを新しく作成
            let (stream, handle) = match rodio::OutputStream::try_default() {
                Ok((s, h)) => (s, h),
                Err(e) => {
                    let error_msg = format!("Failed to create audio output stream: {}", e);
                    error!("{}", error_msg);
                    audio_state.last_error = Some(error_msg);
                    continue;
                }
            };
            
            // 既存のSinkを停止
            if let Some(sink) = &audio_state.rodio_sink {
                if let Ok(sink_guard) = sink.lock() {
                    sink_guard.stop();
                }
            }
            
            // 新しいSinkを作成
            let sink = rodio::Sink::try_new(&handle);
            let sink = match sink {
                Ok(s) => s,
                Err(e) => {
                    let error_msg = format!("Failed to create audio sink: {}", e);
                    error!("{}", error_msg);
                    audio_state.last_error = Some(error_msg);
                    continue;
                }
            };
            
            // オーディオファイルを読み込み
            let file = match File::open(&path) {
                Ok(f) => f,
                Err(e) => {
                    let error_msg = format!("Failed to open audio file: {}", e);
                    error!("{}", error_msg);
                    audio_state.last_error = Some(error_msg);
                    continue;
                }
            };
            
            let source = match rodio::Decoder::new(BufReader::new(file)) {
                Ok(s) => s,
                Err(e) => {
                    let error_msg = format!("Failed to decode audio file: {}", e);
                    error!("{}", error_msg);
                    audio_state.last_error = Some(error_msg);
                    continue;
                }
            };

            // 音量設定
            sink.set_volume(audio_state.volume);
            
            // オーディオを再生
            sink.append(source);
            sink.play();
            
            // Sinkを保存（streamも一緒に保存する必要があるが、簡易実装としてLeakする）
            std::mem::forget(stream); // ストリームをリークして生存させる
            audio_state.rodio_sink = Some(Arc::new(Mutex::new(sink)));
            audio_state.is_playing = true;
            
            info!("Audio playback started for: {:?}", path.file_name());
        }
    }
}

pub fn handle_stop_audio_event(
    mut stop_events: EventReader<StopAudioEvent>,
    mut audio_state: ResMut<AudioState>,
) {
    for _event in stop_events.read() {
        audio_state.is_playing = false;
        
        // Rodio Sinkを停止
        if let Some(sink) = &audio_state.rodio_sink {
            if let Ok(sink_guard) = sink.lock() {
                sink_guard.stop();
            }
        }
        
        // Sinkを削除
        audio_state.rodio_sink = None;
        
        info!("Audio playback stopped");
    }
}

pub fn update_audio_time(
    mut audio_state: ResMut<AudioState>,
    time: Res<Time>,
) {
    if audio_state.is_playing && audio_state.total_duration > 0.0 {
        audio_state.current_time += time.delta_secs();
        
        // ループ処理
        if audio_state.current_time >= audio_state.total_duration {
            audio_state.current_time = 0.0;
        }
        
        // Rodio Sinkが停止したかチェック（オプション）
        let should_stop = if let Some(sink) = &audio_state.rodio_sink {
            if let Ok(sink_guard) = sink.lock() {
                sink_guard.empty() && audio_state.current_time > 1.0
            } else {
                false
            }
        } else {
            false
        };
        
        if should_stop {
            // 1秒以上再生してからemptyになった場合は自然終了（リセット）
            audio_state.is_playing = false;
            audio_state.current_time = 0.0;
        }
    }
}

pub fn sync_audio_with_timeline(
    audio_state: Res<AudioState>,
    mut timeline_state: ResMut<TimelineState>,
    mut play_events: EventWriter<PlayAudioEvent>,
    mut stop_events: EventWriter<StopAudioEvent>,
) {
    if !audio_state.timeline_sync {
        return;
    }
    
    // タイムラインが再生開始された時
    if timeline_state.is_playing && !audio_state.is_playing && audio_state.current_audio_path.is_some() {
        play_events.send(PlayAudioEvent);
        info!("Audio started with timeline");
    }
    
    // タイムラインが停止された時
    if !timeline_state.is_playing && audio_state.is_playing {
        stop_events.send(StopAudioEvent);
        info!("Audio stopped with timeline");
    }
    
    // タイムライン同期時は音楽の時間をタイムラインに同期
    if audio_state.timeline_sync && audio_state.is_playing {
        timeline_state.current_time = audio_state.current_time;
        
        // 音楽の長さに合わせてタイムラインの全長を調整
        if audio_state.total_duration > 0.0 {
            timeline_state.total_time = audio_state.total_duration;
        }
    }
}

pub fn poll_audio_file_dialog(
    mut commands: Commands,
    task_resource: Option<ResMut<AudioFileDialogTask>>,
    mut load_events: EventWriter<LoadAudioEvent>,
) {
    if let Some(mut task_res) = task_resource {
        if let Some(mut task) = task_res.task.take() {
            if let Some(result) = bevy::tasks::block_on(bevy::tasks::futures_lite::future::poll_once(&mut task)) {
                if let Some(file_handle) = result {
                    let path = file_handle.path().to_path_buf();
                    info!("Audio file selected via async dialog: {:?}", path);
                    load_events.send(LoadAudioEvent { path });
                } else {
                    info!("Audio file selection cancelled");
                }
                // タスクは完了したのでリソースを削除
                commands.remove_resource::<AudioFileDialogTask>();
            } else {
                // タスクがまだ完了していない場合、タスクを戻す
                task_res.task = Some(task);
            }
        }
    }
}
