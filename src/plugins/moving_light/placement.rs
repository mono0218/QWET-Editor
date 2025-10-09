use bevy::prelude::*;
use crate::components::*;
use crate::resources::SceneData;
use super::events::*;

pub fn moving_light_placement_ui(
    // This function is now empty but kept for potential future UI
) {
    // MovingLight placement is now handled via Edit menu
}

pub fn handle_add_light_event(
    mut add_light_events: EventReader<AddLightEvent>,
    mut place_light_events: EventWriter<PlaceLightEvent>,
) {
    for _event in add_light_events.read() {
        // Place light at default position (center, 2m above ground)
        let default_position = Vec3::new(0.0, 2.0, 0.0);
        place_light_events.send(PlaceLightEvent {
            position: default_position,
        });
        info!("Added MovingLight at default position: {:?}", default_position);
    }
}

pub fn handle_light_placement(
    mut commands: Commands,
    mut place_light_events: EventReader<PlaceLightEvent>,
    asset_server: Res<AssetServer>,
    mut scene_data: ResMut<SceneData>,
) {
    for event in place_light_events.read() {
        let transform = Transform::from_translation(event.position);
        
        // Create MovingLight with default values (single beam light type)
        let moving_light = MovingLight {
            name: format!("BeamLight_{}", scene_data.lights.len() + 1),
            light_type: MovingLightType::Beam, // Always beam light
            intensity: 1.0,
            color: Color::WHITE,
            pan: 0.0,
            tilt: 0.0,
            beam_angle: 30.0,
            group_id: None,
        };

        // Load the 3D model from QWET-DMX
        let scene_handle: Handle<Scene> = asset_server.load(
            GltfAssetLabel::Scene(0).from_asset("models/beamlight.glb")
        );

        let entity = commands.spawn((
            SceneRoot(scene_handle),
            transform,
            moving_light.clone(),
            Name::new(moving_light.name.clone()),
            crate::components::Selectable,
        )).id();

        // Add SpotLight component for actual illumination
        commands.entity(entity).insert(SpotLight {
            intensity: moving_light.intensity * 1000.0,
            color: moving_light.color,
            shadows_enabled: true,
            inner_angle: (moving_light.beam_angle * 0.8).to_radians(),
            outer_angle: moving_light.beam_angle.to_radians(),
            ..default()
        });

        // Store in scene data
        scene_data.lights.push((transform, moving_light));
        
        info!("Created BeamLight: {} at {:?}", scene_data.lights.last().unwrap().1.name, event.position);
    }
}

