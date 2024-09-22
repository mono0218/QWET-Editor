import NodeSetting from './node/nodeSetting'
import SceneSetting from './scene/sceneSetting'
import MeshSetting from './mesh/meshSetting'
import { QwetEditer } from '@/lib/Editer'
import { GizmoManager } from '@babylonjs/core'

export default function ObjectSettingMenu({
    editer,
    uniqueId,
}: {
    editer: QwetEditer
    uniqueId: number
}) {
    const mesh = editer.scene.getMeshByUniqueId(uniqueId)
    const light = editer.scene.getLightByUniqueId(uniqueId)
    const camera = editer.scene.getCameraByUniqueId(uniqueId)
    const node = editer.scene.getTransformNodeByUniqueId(uniqueId)
    editer.gizmo.positionGizmoEnabled = false
    editer.gizmo.scaleGizmoEnabled = false
    editer.gizmo.rotationGizmoEnabled = false
    if (uniqueId === 0) {
        return <SceneSetting scene={editer.scene} />
    } else if (mesh) {
        switchMode(editer.gizmo)
        editer.gizmo.attachToMesh(mesh)
        return <MeshSetting mesh={mesh} editer={editer} />
    } else if (light) {
        switchMode(editer.gizmo)
        editer.gizmo.attachToNode(light)
    } else if (camera) {
        return <>a</>
    } else if (node) {
        switchMode(editer.gizmo)
        editer.gizmo.attachToNode(node)
        return <NodeSetting node={node} />
    }
}

function switchMode(gizmo: GizmoManager) {
    gizmo.positionGizmoEnabled = true
    gizmo.scaleGizmoEnabled = false
    gizmo.rotationGizmoEnabled = false

    document.addEventListener('keydown', function (event) {
        if (event.key === 'p') {
            gizmo.positionGizmoEnabled = true
            gizmo.scaleGizmoEnabled = false
            gizmo.rotationGizmoEnabled = false
        } else if (event.key === 's') {
            gizmo.positionGizmoEnabled = false
            gizmo.scaleGizmoEnabled = true
            gizmo.rotationGizmoEnabled = false
        } else if (event.key === 'r') {
            gizmo.positionGizmoEnabled = false
            gizmo.scaleGizmoEnabled = false
            gizmo.rotationGizmoEnabled = true
        }
    })
}
