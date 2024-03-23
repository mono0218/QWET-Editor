import {AbstractMesh, Mesh, Scene, SceneLoader} from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

export function importObject({
    scene,
    name,
    file,
}: {
    scene: Scene
    name: string
    file: File
}) {
    SceneLoader.ImportMeshAsync('', '', file, scene).then((result) => {
        const root = getParent(result.meshes[0])
        root.name = name
        scene.rootNodes.push(root)
    })
}

function getParent(_3DObject: AbstractMesh ){
    let child = _3DObject;
    let parent;
    do {
        if (child.parent === null) {
            parent = _3DObject;
            break;
        } else {
            parent = child.parent
            child = parent;
        }
    } while (child.parent !== null);
    return parent
}
