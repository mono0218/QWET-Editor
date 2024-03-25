import {
    AbstractMesh,
    Node,
    Scene,
    SceneLoader,
    TransformNode,
} from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import { tfNodeManager } from '../manager/tfNodeManager'

export function importObject({
    scene,
    name,
    file,
    manager,
}: {
    scene: Scene
    name: string
    file: File
    manager: tfNodeManager
}) {
    SceneLoader.ImportMeshAsync('', '', file, scene).then((result) => {
        const rootMesh = getParent(result.meshes[0])
        const rootNode = new TransformNode(name, scene)
        rootMesh.parent = rootNode
        manager.addNode(rootNode)
    })
}

function getParent(_3DObject: AbstractMesh) {
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
