import { QwetComponent } from '@/types/component'
import { Scene } from '@babylonjs/core'
import { QwetEditor } from '@/components/Editor'

export class QwetObject {
    scene: Scene
    editor: QwetEditor

    constructor(scene: Scene, editor: QwetEditor) {
        this.scene = scene
        this.editor = editor
    }

    uniqueId: number
    name: string
    components: Array<QwetComponent> = []

    position: {
        x: number
        y: number
        z: number
    } = { x: 0, y: 0, z: 0 }

    rotation: {
        x: number
        y: number
        z: number
    } = { x: 0, y: 0, z: 0 }

    scale: {
        x: number
        y: number
        z: number
    } = { x: 1, y: 1, z: 1 }

    addComponent(component: QwetComponent) {
        component.object = this
        this.components.push(component)
        component.init()
    }

    setPos(x: number, y: number, z: number) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }

    setRot(x: number, y: number, z: number) {
        this.rotation.x = x
        this.rotation.y = y
        this.rotation.z = z
    }

    setScale(x: number, y: number, z: number) {
        this.scale.x = x
        this.scale.y = y
        this.scale.z = z
    }
}
