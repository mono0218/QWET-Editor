use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use crate::{components::*, resources::*};

pub fn draw_selection_gizmos(
    mut gizmos: Gizmos,
    selected_query: Query<&GlobalTransform, With<Selected>>,
    editor_state: Res<EditorState>,
) {
    if !editor_state.show_gizmo {
        return;
    }

    for global_transform in selected_query.iter() {
        let translation = global_transform.translation();
        let rotation = global_transform.to_scale_rotation_translation().1;
        let scale = global_transform.to_scale_rotation_translation().0.max_element();

        // Draw coordinate axes (X: Red, Y: Green, Z: Blue)
        let axis_length = 1.5 * scale.max(1.0);
        
        // X-axis (Red)
        let x_end = translation + rotation.mul_vec3(Vec3::X * axis_length);
        gizmos.line(translation, x_end, Color::srgb(1.0, 0.0, 0.0));
        
        // Y-axis (Green)  
        let y_end = translation + rotation.mul_vec3(Vec3::Y * axis_length);
        gizmos.line(translation, y_end, Color::srgb(0.0, 1.0, 0.0));
        
        // Z-axis (Blue)
        let z_end = translation + rotation.mul_vec3(Vec3::Z * axis_length);
        gizmos.line(translation, z_end, Color::srgb(0.0, 0.0, 1.0));

        // Draw selection wireframe box around the object
        let box_size = Vec3::splat(0.5 * scale.max(1.0));
        gizmos.cuboid(
            Transform::from_translation(translation)
                .with_rotation(rotation)
                .with_scale(box_size),
            Color::srgba(1.0, 1.0, 0.0, 0.8), // Yellow wireframe
        );

        // Draw center point
        gizmos.sphere(translation, 0.1 * scale.max(0.1), Color::srgb(1.0, 1.0, 1.0));
        
        // Add arrow heads to axes for better visibility
        let arrow_size = 0.2 * scale.max(0.2);
        
        // X-axis arrow (Red)
        let x_arrow_start = x_end - rotation.mul_vec3(Vec3::X * arrow_size);
        gizmos.line(x_end, x_arrow_start + rotation.mul_vec3(Vec3::Y * arrow_size * 0.5), Color::srgb(1.0, 0.0, 0.0));
        gizmos.line(x_end, x_arrow_start - rotation.mul_vec3(Vec3::Y * arrow_size * 0.5), Color::srgb(1.0, 0.0, 0.0));
        
        // Y-axis arrow (Green)
        let y_arrow_start = y_end - rotation.mul_vec3(Vec3::Y * arrow_size);
        gizmos.line(y_end, y_arrow_start + rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 1.0, 0.0));
        gizmos.line(y_end, y_arrow_start - rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 1.0, 0.0));
        
        // Z-axis arrow (Blue)
        let z_arrow_start = z_end - rotation.mul_vec3(Vec3::Z * arrow_size);
        gizmos.line(z_end, z_arrow_start + rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 0.0, 1.0));
        gizmos.line(z_end, z_arrow_start - rotation.mul_vec3(Vec3::X * arrow_size * 0.5), Color::srgb(0.0, 0.0, 1.0));
    }
}

