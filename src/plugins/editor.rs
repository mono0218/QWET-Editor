use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{resources::*};

pub struct EditorPlugin;

#[derive(Component)]
pub struct EditorCamera;

impl Plugin for EditorPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<EditorState>()
            .init_resource::<SceneData>()
            .add_systems(Startup, setup_scene)
            .add_systems(Update, (
                camera_controller,
                editor_ui,
            ));
    }
}

fn setup_scene(
    mut commands: Commands,
) {
    // Camera
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(0.0, 5.0, 10.0)
            .looking_at(Vec3::ZERO, Vec3::Y),
        EditorCamera,
    ));

    // Light
    commands.spawn((
        DirectionalLight {
            shadows_enabled: true,
            ..default()
        },
        Transform {
            translation: Vec3::new(0.0, 2.0, 0.0),
            rotation: Quat::from_rotation_x(-std::f32::consts::FRAC_PI_4),
            ..default()
        },
    ));

}

fn camera_controller(
    mut camera_query: Query<&mut Transform, (With<Camera>, With<EditorCamera>)>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    mut mouse_motion_events: EventReader<bevy::input::mouse::MouseMotion>,
    time: Res<Time>,
    mut editor_state: ResMut<EditorState>,
) {
    if let Ok(mut transform) = camera_query.get_single_mut() {
        let mut velocity = Vec3::ZERO;
        let speed = 5.0;

        // Keyboard movement (WASD)
        if keyboard_input.pressed(KeyCode::KeyW) {
            velocity += -*transform.local_z();
        }
        if keyboard_input.pressed(KeyCode::KeyS) {
            velocity += *transform.local_z();
        }
        if keyboard_input.pressed(KeyCode::KeyA) {
            velocity += -*transform.local_x();
        }
        if keyboard_input.pressed(KeyCode::KeyD) {
            velocity += *transform.local_x();
        }

        // Vertical movement (Q/E for up/down)
        if keyboard_input.pressed(KeyCode::KeyQ) {
            velocity += Vec3::Y;
        }
        if keyboard_input.pressed(KeyCode::KeyE) {
            velocity += -Vec3::Y;
        }

        transform.translation += velocity * speed * time.delta_secs();

        // Mouse look controls
        // Right click drag OR Middle click drag OR Alt + Left click drag
        let camera_look_active = mouse_button_input.pressed(MouseButton::Right) 
            || mouse_button_input.pressed(MouseButton::Middle)
            || (mouse_button_input.pressed(MouseButton::Left) && keyboard_input.pressed(KeyCode::AltLeft));

        if camera_look_active {
            for mouse_motion in mouse_motion_events.read() {
                let sensitivity = 0.003;
                let yaw = -mouse_motion.delta.x * sensitivity;
                let pitch = -mouse_motion.delta.y * sensitivity;

                // Apply rotation
                transform.rotate_y(yaw);
                transform.rotate_local_x(pitch);
            }
        }
    }
    
    // Keyboard shortcuts for UI toggle
    if keyboard_input.just_pressed(KeyCode::KeyP) {
        editor_state.show_properties = !editor_state.show_properties;
        info!("Properties panel toggled: {}", editor_state.show_properties);
    }
}

fn editor_ui(
    mut contexts: EguiContexts,
    mut editor_state: ResMut<EditorState>,
    scene_data: Res<SceneData>,
    mut import_events: EventWriter<crate::plugins::gltf_import::ImportGltfEvent>,
    mut save_events: EventWriter<crate::plugins::scene_manager::SaveSceneEvent>,
    mut load_events: EventWriter<crate::plugins::scene_manager::LoadSceneEvent>,
    mut new_events: EventWriter<crate::plugins::scene_manager::NewSceneEvent>,
    mut add_light_events: EventWriter<crate::plugins::moving_light::AddLightEvent>,
) {
    let ctx = contexts.ctx_mut();

    // Top menu bar
    egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
        egui::menu::bar(ui, |ui| {
            ui.menu_button("File", |ui| {
                if ui.button("New Scene").clicked() {
                    new_events.send(crate::plugins::scene_manager::NewSceneEvent);
                    info!("New Scene created");
                }
                if ui.button("Open Scene").clicked() {
                    if let Some(path) = rfd::FileDialog::new()
                        .add_filter("QWET Scene", &["json"])
                        .set_directory("./scenes")
                        .pick_file()
                    {
                        load_events.send(crate::plugins::scene_manager::LoadSceneEvent { path });
                        info!("Loading scene from file");
                    }
                }
                if ui.button("Save Scene").clicked() {
                    if let Some(path) = rfd::FileDialog::new()
                        .add_filter("QWET Scene", &["json"])
                        .set_directory("./scenes")
                        .set_file_name("scene.json")
                        .save_file()
                    {
                        save_events.send(crate::plugins::scene_manager::SaveSceneEvent { path });
                        info!("Saving scene to file");
                    }
                }
                ui.separator();
                if ui.button("Import GLB").clicked() {
                    info!("Opening GLB file dialog...");
                    // Trigger async file dialog
                    import_events.send(crate::plugins::gltf_import::ImportGltfEvent { 
                        path: std::path::PathBuf::new() // Empty path triggers file dialog
                    });
                }
            });

            ui.menu_button("Edit", |ui| {
                if ui.button("Add MovingLight").clicked() {
                    editor_state.tool_mode = ToolMode::Select; // Switch to select mode after adding
                    // Send event to trigger light placement
                    add_light_events.send(crate::plugins::moving_light::AddLightEvent);
                    info!("Add MovingLight selected");
                }
                ui.separator();
                if ui.button("Undo").clicked() {
                    info!("Undo clicked");
                }
                if ui.button("Redo").clicked() {
                    info!("Redo clicked");
                }
            });

            ui.menu_button("View", |ui| {
                ui.checkbox(&mut editor_state.show_gizmo, "Show Gizmos");
                ui.checkbox(&mut editor_state.show_properties, "Show Properties");
            });
        });
    });

    // Left panel - Tool palette
    egui::SidePanel::left("tool_panel").default_width(200.0).show(ctx, |ui| {
        ui.heading("Tools");

        if ui.selectable_label(matches!(editor_state.tool_mode, ToolMode::Select), "Select").clicked() {
            editor_state.tool_mode = ToolMode::Select;
            info!("Select tool selected");
        }


        if ui.selectable_label(matches!(editor_state.tool_mode, ToolMode::Animation), "Animation").clicked() {
            editor_state.tool_mode = ToolMode::Animation;
            info!("Animation tool selected");
        }

        ui.separator();
        ui.heading("Scene Objects");
        
        ui.label(format!("Models: {}", scene_data.imported_models.len()));
    });


}