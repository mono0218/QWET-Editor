import { QwetEditor } from '@/lib/Editor'
import {
    FreeCamera,
    MeshBuilder,
    RenderTargetTexture,
    StandardMaterial,
    Vector3,
} from '@babylonjs/core'

export class RttManager {
    editor: QwetEditor

    constructor(editor: QwetEditor) {
        this.editor = editor
    }

    async addRtt() {
        const camera = new FreeCamera(
            'camera2',
            new Vector3(0, 0, 0),
            this.editor.scene
        )
        const renderTarget: RenderTargetTexture = new RenderTargetTexture(
            'depth',
            1024,
            this.editor.scene,
            true
        )
        renderTarget.activeCamera = camera
        this.editor.scene.customRenderTargets.push(renderTarget)

        const plane = MeshBuilder.CreatePlane(
            'map',
            { width: 30, height: 30, size: 30 },
            this.editor.scene
        )
        const rttMaterial = new StandardMaterial(
            'RTT material',
            this.editor.scene
        )
        rttMaterial.emissiveTexture = renderTarget
        plane.material = rttMaterial

        this.editor.meshManager.addMesh(plane)
        this.editor.cameraManager.addCamera(camera)

        this.loadObject(renderTarget)
    }

    loadObject(renderTarget: RenderTargetTexture) {
        setInterval(() => {
            renderTarget.renderList = this.editor.scene.meshes
        }, 1000)
    }
}
