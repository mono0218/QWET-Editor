use bevy::prelude::*;
use crate::components::BarrierMesh;

/// バリアメッシュの表示/非表示を切り替える
pub fn update_barrier_visibility(
    mut barrier_query: Query<(&BarrierMesh, &mut Visibility), Changed<BarrierMesh>>,
) {
    for (barrier, mut visibility) in barrier_query.iter_mut() {
        *visibility = if barrier.visible {
            Visibility::Visible
        } else {
            Visibility::Hidden
        };
    }
}

/// バリアメッシュのサイズや色が変更された時にメッシュとマテリアルを更新
pub fn update_barrier_mesh(
    mut barrier_query: Query<
        (&BarrierMesh, &Mesh3d, &MeshMaterial3d<StandardMaterial>),
        Changed<BarrierMesh>
    >,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    for (barrier, mesh_handle, material_handle) in barrier_query.iter_mut() {
        // メッシュを更新
        if let Some(mesh) = meshes.get_mut(&mesh_handle.0) {
            *mesh = Mesh::from(Cuboid::new(barrier.size.x, barrier.size.y, barrier.size.z));
        }

        // マテリアルの色を更新
        if let Some(material) = materials.get_mut(&material_handle.0) {
            material.base_color = barrier.color;
        }
    }
}
