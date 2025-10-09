use bevy::prelude::*;
use crate::components::{BarrierMesh, Selectable};
use super::events::*;

pub fn handle_add_barrier(
    mut commands: Commands,
    mut add_events: EventReader<AddBarrierEvent>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    for _ in add_events.read() {
        let barrier = BarrierMesh::default();

        info!("Adding barrier mesh: {}", barrier.name);

        // 四角形のメッシュを作成
        let mesh = Mesh::from(Cuboid::new(barrier.size.x, barrier.size.y, barrier.size.z));

        // 半透明マテリアルを作成
        let material = StandardMaterial {
            base_color: barrier.color,
            alpha_mode: AlphaMode::Blend,
            double_sided: true,
            cull_mode: None,
            ..default()
        };

        let entity = commands.spawn((
            Mesh3d(meshes.add(mesh)),
            MeshMaterial3d(materials.add(material)),
            Transform::from_translation(Vec3::new(0.0, 1.0, 0.0)),
            barrier.clone(),
            Name::new("Barrier Mesh"),
            Selectable,
        )).id();

        info!("Barrier mesh spawned: {:?} at position (0, 1, 0)", entity);
    }
}
