import { DirectionalLight, Vector3 } from '@babylonjs/core'
import { QwetComponent } from '@/types/component'
import { QwetObject } from '@/types/object'
import { basicInspector } from '@/components/uiComponents/basicInspector'

export class DirectionalLightComponent implements QwetComponent {
    object: QwetObject
    light: DirectionalLight | null = null

    constructor() {}

    init(): void {
        this.light = new DirectionalLight(
            'DirectionalLight',
            new Vector3(0, 0, 0),
            this.object.scene
        )

        this.uiComponentList.push(basicInspector(this))
    }

    update(): void {
        if (!this.light) throw new Error('Light is not initialized')

        this.light.position = new Vector3(
            this.object.position.x,
            this.object.position.y,
            this.object.position.z
        )
    }

    destroy(): void {}

    uiComponentList: JSX.Element[] = []
    ui(): JSX.Element {
        return <>{basicInspector(this)}</>
    }
}
