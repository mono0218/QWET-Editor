use bevy::prelude::*;
use crate::resources::EditorState;
use super::plugin::EditorCamera;

pub fn camera_controller(
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
