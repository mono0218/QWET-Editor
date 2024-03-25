import { tfNodeManager } from '../lib/manager/tfNodeManager'
import NodeSetting from './node/nodeSetting'
import SceneSetting from './scene/sceneSetting'
import { Scene } from '@babylonjs/core'

export default function ObjectSettingMenu({
    scene,
    nodeManager,
    uniqueId,
}: {
    scene: Scene
    nodeManager: tfNodeManager
    uniqueId: number
}) {
    if (uniqueId === 0) return <SceneSetting scene={scene} />

    return <NodeSetting nodeManager={nodeManager} uniqueId={uniqueId} />
}
