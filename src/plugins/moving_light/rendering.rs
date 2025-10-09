use bevy::prelude::*;
use crate::components::*;

pub fn update_moving_light_mesh_transforms(
    moving_light_query: Query<(&MovingLight, &Children), Changed<MovingLight>>,
    mut transform_query: Query<&mut Transform>,
    name_query: Query<&Name>,
    children_query: Query<&Children>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mesh_materials_query: Query<&MeshMaterial3d<StandardMaterial>>,
) {
    for (moving_light, children) in moving_light_query.iter() {
        // Recursively search for specific mesh names and apply transformations
        apply_pan_tilt_to_children(
            children, 
            moving_light, 
            &mut transform_query, 
            &name_query,
            &children_query
        );
        
        // Update light emissive materials
        update_light_emissive_materials(
            children,
            moving_light,
            &mut materials,
            &mesh_materials_query,
            &name_query,
            &children_query
        );
    }
}

pub fn apply_pan_tilt_to_children(
    children: &Children,
    moving_light: &MovingLight,
    transform_query: &mut Query<&mut Transform>,
    name_query: &Query<&Name>,
    children_query: &Query<&Children>,
) {
    for &child in children.iter() {
        // Check if this child has a name and apply pan/tilt transformations
        if let Ok(name) = name_query.get(child) {
            if let Ok(mut transform) = transform_query.get_mut(child) {
                match name.as_str() {
                    "Arm" => {
                        // Pan制御 - Y軸回転（水平回転）のみ、位置は変更しない
                        transform.rotation = Quat::from_rotation_y(moving_light.pan);
                    }
                    "Light.001" => {
                        // Tilt制御 - Z軸回転（垂直回転）のみ、位置は変更しない
                        transform.rotation = Quat::from_rotation_z(moving_light.tilt);
                    }
                    _ => {}
                }
            }
        }
        
        // Recursively search children's children
        if let Ok(grandchildren) = children_query.get(child) {
            apply_pan_tilt_to_children(
                grandchildren,
                moving_light,
                transform_query,
                name_query,
                children_query
            );
        }
    }
}

pub fn update_light_emissive_materials(
    children: &Children,
    moving_light: &MovingLight,
    materials: &mut ResMut<Assets<StandardMaterial>>,
    mesh_materials_query: &Query<&MeshMaterial3d<StandardMaterial>>,
    name_query: &Query<&Name>,
    children_query: &Query<&Children>,
) {
    for &child in children.iter() {
        // Check if this child has a name and is the light emissive surface
        if let Ok(name) = name_query.get(child) {
            if name.as_str() == "円柱.002" {
                println!("Found 円柱.002 material");
                if let Ok(material_mesh) = mesh_materials_query.get(child) {
                    if let Some(material) = materials.get_mut(&material_mesh.0) {
                        let linear_color = moving_light.color.to_linear();
                        let r = linear_color.red;
                        let g = linear_color.green;
                        let b = linear_color.blue;
                        let emissive = moving_light.intensity;
                        
                        material.base_color = moving_light.color;
                        material.emissive = LinearRgba::rgb(r * emissive * 20.0, g * emissive * 20.0, b * emissive * 20.0);
                        material.alpha_mode = AlphaMode::Opaque;
                        println!("Updated 円柱.002 color: R={:.2}, G={:.2}, B={:.2}", r, g, b);
                    }
                }
            }
        }
        
        // Recursively search children's children
        if let Ok(grandchildren) = children_query.get(child) {
            update_light_emissive_materials(
                grandchildren,
                moving_light,
                materials,
                mesh_materials_query,
                name_query,
                children_query
            );
        }
    }
}

