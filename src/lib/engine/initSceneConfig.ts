import { Scene, TransformNode, Vector3 } from '@babylonjs/core'

export default function initSceneConfig(scene: Scene) {
    const ListenerStartPosition = new TransformNode(
        'PlayerStartPosition',
        scene
    )
    const LiverStartPosition = new TransformNode('LiverStartPosition', scene)

    ListenerStartPosition.position = new Vector3(0, 0, 0)
    LiverStartPosition.position = new Vector3(0, 0, 0)

    return
}
