import { QwetComponent } from '@/types/component'
import { QwetObject } from '@/types/object'
import { PointLight, Vector3 } from '@babylonjs/core'
import { basicInspector } from '@/components/uiComponents/basicInspector'

export class PointLightComponent implements QwetComponent {
    object: QwetObject
    pointLight: PointLight | null = null

    constructor() {}

    init(): void {
        this.pointLight = new PointLight(
            'PointLight',
            new Vector3(0, 0, 0),
            this.object.scene
        )

        this.uiComponentList.push(basicInspector(this))
    }

    update(): void {
        if (!this.pointLight) throw new Error('Light is not initialized')

        this.pointLight.position = new Vector3(
            this.object.position.x,
            this.object.position.y,
            this.object.position.z
        )
    }

    destroy(): void {
        if (!this.pointLight) throw new Error('Light is not initialized')

        this.pointLight.dispose()
    }

    uiComponentList: JSX.Element[] = []

    ui(): JSX.Element {
        return <>{this.uiComponentList.map((uiComponent) => uiComponent)}</>
    }
}
