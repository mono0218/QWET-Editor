# QWET Live Space Editor

QWETライブシステム用のライブ空間作成エディターです。

## 機能

- **GLBファイルのインポート**: 3Dステージモデルをインポート
- **ムービングライトの配置**: スポットライト、ウォッシュライト、ビームライトの配置と設定
- **アバターの配置**: パフォーマー用のアバターを配置
- **アニメーションエディター**: ライトの動きとエフェクトのタイムライン編集

## 開発環境

- Rust 1.75+
- Bevy 0.15.3
- bevy_egui 0.32.0

## ビルドと実行

```bash
# 開発モード
cargo run

# リリースビルド
cargo run --release
```

## 操作方法

### カメラコントロール
- `W/A/S/D`: カメラ移動
- `Right Click + Mouse`: カメラ視点変更

### ツール
- **Select**: オブジェクト選択モード
- **Moving Light**: ムービングライト配置モード
- **Avatar**: アバター配置モード
- **Animation**: アニメーション編集モード

### ファイル操作
- **File → Import GLB**: GLB/GLTFファイルのインポート
- **File → Save Scene**: シーン保存
- **File → Open Scene**: シーン読み込み

## プロジェクト構造

```
src/
├── main.rs              # メインアプリケーション
├── components.rs        # ゲームコンポーネント定義
├── resources.rs         # リソース定義
├── systems/            
│   ├── mod.rs
│   └── selection.rs     # オブジェクト選択システム
└── plugins/            # 機能別プラグイン
    ├── mod.rs
    ├── editor.rs        # メインエディター
    ├── gltf_import.rs   # GLBインポート
    ├── moving_light.rs  # ムービングライト
    ├── avatar.rs        # アバター
    └── animation_editor.rs # アニメーション

assets/
├── models/             # 3Dモデル
├── textures/          # テクスチャ
└── audio/            # オーディオファイル
```

## 今後の拡張予定

- [ ] より詳細なライト制御（DMX対応）
- [ ] 音楽同期機能
- [ ] より多くの3Dモデル形式サポート
- [ ] リアルタイムプレビュー機能
- [ ] ネットワーク同期機能

## ライセンス

このプロジェクトはQWETシステムの一部として開発されています。