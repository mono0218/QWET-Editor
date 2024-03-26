import { Scene, SceneLoader, TransformNode } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import { tfNodeManager } from '../manager/tfNodeManager'
import { getParent } from './getParent'

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
