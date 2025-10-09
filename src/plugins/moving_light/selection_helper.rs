use bevy::prelude::*;
use crate::components::*;

pub fn ensure_moving_light_root_only_selectable(
    mut commands: Commands,
    moving_light_query: Query<Entity, (With<crate::components::MovingLight>, With<crate::components::Selectable>)>,
    children_query: Query<&Children>,
    child_selectable_query: Query<Entity, (With<crate::components::Selectable>, Without<crate::components::MovingLight>)>,
) {
    // Remove Selectable component from children of MovingLight entities
    for light_entity in moving_light_query.iter() {
        if let Ok(children) = children_query.get(light_entity) {
            for &child in children.iter() {
                remove_selectable_recursive(&mut commands, child, &children_query, &child_selectable_query);
            }
        }
    }
}

pub fn remove_selectable_recursive(
    commands: &mut Commands,
    entity: Entity,
    children_query: &Query<&Children>,
    child_selectable_query: &Query<Entity, (With<crate::components::Selectable>, Without<crate::components::MovingLight>)>,
) {
    // Remove Selectable from this entity if it has it (but is not a MovingLight root)
    if child_selectable_query.get(entity).is_ok() {
        commands.entity(entity).remove::<crate::components::Selectable>();
    }
    
    // Recursively remove from children
    if let Ok(children) = children_query.get(entity) {
        for &child in children.iter() {
            remove_selectable_recursive(commands, child, children_query, child_selectable_query);
        }
    }
}
