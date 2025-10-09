use bevy::prelude::*;
use crate::components::{BarrierMesh, Selected};

/// デバッグ用：バリアメッシュのTransformが変更された時にログ出力
pub fn debug_barrier_transform(
    barrier_query: Query<
        (Entity, &BarrierMesh, &Transform, Option<&Selected>),
        Changed<Transform>
    >,
) {
    for (entity, barrier, transform, selected) in barrier_query.iter() {
        let selected_str = if selected.is_some() { "[SELECTED]" } else { "" };
        info!(
            "Barrier {} {:?} {} Transform updated: pos={:?}",
            barrier.name,
            entity,
            selected_str,
            transform.translation
        );
    }
}
