import { Scene, SceneLoader } from '@babylonjs/core'
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
    SceneLoader.ImportMesh('', '', file, scene, (meshes) => {
        meshes.forEach((mesh) => {
            mesh.id = name
        })
    })
}
