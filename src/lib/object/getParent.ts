import { AbstractMesh, Node } from '@babylonjs/core'

export function getParent(_3DObject: AbstractMesh) {
    let child = _3DObject
    child.parent
    let parent
    do {
        if (child.parent === null) {
            parent = _3DObject
            break
        } else {
            parent = child.parent
            if (parent instanceof Node) {
                parent = child as AbstractMesh
                break
            }
            child = parent
        }
    } while (child.parent !== null)
    return parent
}
