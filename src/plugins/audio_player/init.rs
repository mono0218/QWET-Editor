use bevy::prelude::*;
use std::path::Path;
use std::fs::File;
use std::io::BufReader;

pub fn initialize_rodio() {
    info!("Rodio audio system is ready to use");
}

pub fn get_audio_duration(_path: &Path) -> Result<f32, Box<dyn std::error::Error>> {
    // rodio 0.20では音声ファイルの長さを簡単に取得できないため、
    // デフォルト値として120秒を返す
    // TODO: symphoniaなどの別のライブラリを使用して正確な長さを取得する
    Ok(120.0)
}
