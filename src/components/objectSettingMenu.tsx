import NodeSetting from './node/nodeSetting'
import SceneSetting from './scene/sceneSetting'
import { Scene } from '@babylonjs/core'
import MeshSetting from './mesh/meshSetting'

export default function ObjectSettingMenu({
    scene,
    uniqueId,
}: {
    scene: Scene
    uniqueId: number
}) {
    const mesh = scene.getMeshByUniqueId(uniqueId)
    const light = scene.getLightByUniqueId(uniqueId)
    const camera = scene.getCameraByUniqueId(uniqueId)
    const node = scene.getTransformNodeByUniqueId(uniqueId)

    if (uniqueId === 0) {
        return <SceneSetting scene={scene} />
    } else if (mesh) {
        return <MeshSetting mesh={mesh} />
    } else if (light) {
        return <>a</>
    } else if (camera) {
        return <>a</>
    } else if (node) {
        return <NodeSetting node={node} />
    }
}
