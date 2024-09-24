import { QwetObject } from '@/types/object'
import { QwetComponent } from '@/types/component'
import { FreeCamera } from '@babylonjs/core'

export class CameraComponent implements QwetComponent {
    object: QwetObject
    camera: FreeCamera

    constructor(camera: FreeCamera) {
        this.camera = camera
        this.object.uniqueId = camera.uniqueId
    }

    init(): void {}

    update(): void {
        const pos = this.object.position
        const rot = this.object.rotation

        this.camera.position.set(pos.x, pos.y, pos.z)
        this.camera.rotation.set(rot.x, rot.y, rot.z)
    }

    destroy(): void {
        this.camera.dispose()
    }

    ui(): JSX.Element {
        return <p>aaa</p>
    }
}
