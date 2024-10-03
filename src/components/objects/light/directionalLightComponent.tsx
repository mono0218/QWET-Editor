import { DirectionalLight, Vector3 } from '@babylonjs/core'
import { QwetComponent } from '@/types/component'
import { QwetObject } from '@/types/object'
import { BasicInspector } from '@/components/uiComponents/basicInspector'
import { QwetUiComponent } from '@/types/uiComponent'

export class DirectionalLightComponent implements QwetComponent {
    object: QwetObject | undefined
    light: DirectionalLight | null = null
    uiComponentList: QwetUiComponent[] = []

    constructor() {}

    init(): void {
        if (!this.object) throw new Error('Object is not initialized')
        this.light = new DirectionalLight(
            'DirectionalLight',
            new Vector3(0, 0, 0),
            this.object!.scene
        )
        this.object.uniqueId = this.light.uniqueId

        this.uiComponentList.push(new BasicInspector(this))
    }

    update(): void {
        if (!this.object) throw new Error('Object is not initialized')
        if (!this.light) throw new Error('Light is not initialized')

        this.light.position = new Vector3(
            this.object.position.x,
            this.object.position.y,
            this.object.position.z
        )
    }

    destroy(): void {}

    ui(): JSX.Element {
        return <></>
    }
}
