import NodeSetting from './node/nodeSetting'
import SceneSetting from './scene/sceneSetting'
import MeshSetting from './mesh/meshSetting'
import { QwetEditor } from '@/lib/Editor'
import { GizmoManager } from '@babylonjs/core'

export default function ObjectSettingMenu({
    editor,
    uniqueId,
}: {
    editor: QwetEditor
    uniqueId: number
}) {
    const mesh = editor.scene.getMeshByUniqueId(uniqueId)
    const light = editor.scene.getLightByUniqueId(uniqueId)
    const camera = editor.scene.getCameraByUniqueId(uniqueId)
    const node = editor.scene.getTransformNodeByUniqueId(uniqueId)
    editor.gizmo.positionGizmoEnabled = false
    editor.gizmo.scaleGizmoEnabled = false
    editor.gizmo.rotationGizmoEnabled = false
    if (uniqueId === 0) {
        return <SceneSetting scene={editor.scene} />
    } else if (mesh) {
        switchMode(editor.gizmo)
        editor.gizmo.attachToMesh(mesh)
        return <MeshSetting mesh={mesh} editor={editor} />
    } else if (light) {
        switchMode(editor.gizmo)
        editor.gizmo.attachToNode(light)
    } else if (camera) {
        return <>a</>
    } else if (node) {
        switchMode(editor.gizmo)
        editor.gizmo.attachToNode(node)
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
