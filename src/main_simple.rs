use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts, EguiPlugin};

fn main() {
    App::new()
        .add_plugins((
            DefaultPlugins.set(WindowPlugin {
                primary_window: Some(Window {
                    title: "QWET Live Space Editor".to_string(),
                    resolution: (1280., 720.).into(),
                    ..default()
                }),
                ..default()
            }),
            EguiPlugin,
        ))
        .add_systems(Startup, setup_scene)
        .add_systems(Update, (camera_controller, ui_system))
        .run();
}

#[derive(Component)]
struct EditorCamera;

fn setup_scene(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // Camera
    commands.spawn((
        Camera3dBundle {
            transform: Transform::from_xyz(0.0, 5.0, 10.0)
                .looking_at(Vec3::ZERO, Vec3::Y),
            ..default()
        },
        EditorCamera,
    ));

    // Light
    commands.spawn(DirectionalLightBundle {
        directional_light: DirectionalLight {
            shadows_enabled: true,
            ..default()
        },
        transform: Transform {
            translation: Vec3::new(0.0, 2.0, 0.0),
            rotation: Quat::from_rotation_x(-std::f32::consts::FRAC_PI_4),
            ..default()
        },
        ..default()
    });

    // Floor
    commands.spawn((
        Mesh3d(meshes.add(Plane3d::default().mesh().size(20.0, 20.0))),
        MeshMaterial3d(materials.add(Color::srgb(0.3, 0.3, 0.3))),
    ));
}

fn camera_controller(
    mut camera_query: Query<&mut Transform, (With<Camera>, With<EditorCamera>)>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    mouse_button_input: Res<ButtonInput<MouseButton>>,
    mut mouse_motion_events: EventReader<bevy::input::mouse::MouseMotion>,
    time: Res<Time>,
) {
    if let Ok(mut transform) = camera_query.get_single_mut() {
        let mut velocity = Vec3::ZERO;
        let speed = 5.0;

        if keyboard_input.pressed(KeyCode::KeyW) {
            velocity += -transform.local_z();
        }
        if keyboard_input.pressed(KeyCode::KeyS) {
            velocity += transform.local_z();
        }
        if keyboard_input.pressed(KeyCode::KeyA) {
            velocity += -transform.local_x();
        }
        if keyboard_input.pressed(KeyCode::KeyD) {
            velocity += transform.local_x();
        }

        transform.translation += velocity * speed * time.delta_secs();

        if mouse_button_input.pressed(MouseButton::Right) {
            for mouse_motion in mouse_motion_events.read() {
                let yaw = -mouse_motion.delta.x * 0.003;
                let pitch = -mouse_motion.delta.y * 0.002;

                transform.rotate_y(yaw);
                transform.rotate_local_x(pitch);
            }
        }
    }
}

fn ui_system(mut contexts: EguiContexts) {
    let ctx = contexts.ctx_mut();

    // Top menu bar
    egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
        egui::menu::bar(ui, |ui| {
            ui.menu_button("File", |ui| {
                if ui.button("New Scene").clicked() {
                    info!("New Scene clicked");
                }
                if ui.button("Open Scene").clicked() {
                    info!("Open Scene clicked");
                }
                if ui.button("Save Scene").clicked() {
                    info!("Save Scene clicked");
                }
                ui.separator();
                if ui.button("Import GLB").clicked() {
                    info!("Import GLB clicked");
                }
            });

            ui.menu_button("Edit", |ui| {
                if ui.button("Undo").clicked() {
                    info!("Undo clicked");
                }
                if ui.button("Redo").clicked() {
                    info!("Redo clicked");
                }
            });
        });
    });

    // Left panel - Tools
    egui::SidePanel::left("tool_panel").default_width(200.0).show(ctx, |ui| {
        ui.heading("Tools");
        
        if ui.button("Select").clicked() {
            info!("Select tool selected");
        }
        if ui.button("Moving Light").clicked() {
            info!("Moving Light tool selected");
        }
        if ui.button("Avatar").clicked() {
            info!("Avatar tool selected");
        }
        if ui.button("Animation").clicked() {
            info!("Animation tool selected");
        }
        
        ui.separator();
        ui.heading("Scene Objects");
        ui.label("Lights: 0");
        ui.label("Avatars: 0");
        ui.label("Models: 0");
    });

    // Right panel - Properties
    egui::SidePanel::right("properties_panel").default_width(250.0).show(ctx, |ui| {
        ui.heading("Properties");
        ui.label("No entity selected");
    });

    // Bottom panel - Animation timeline
    egui::TopBottomPanel::bottom("timeline_panel").default_height(150.0).show(ctx, |ui| {
        ui.heading("Animation Timeline");
        ui.label("Timeline controls will go here");
    });
}