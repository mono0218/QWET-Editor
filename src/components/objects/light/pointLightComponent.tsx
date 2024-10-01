import { QwetComponent } from '@/types/component'
import { QwetObject } from '@/types/object'
import { PointLight, Vector3 } from '@babylonjs/core'
import { BasicInspector } from '@/components/uiComponents/basicInspector'
import { QwetUiComponent } from '@/types/uiComponent'

export class PointLightComponent implements QwetComponent {
    object: QwetObject | undefined
    pointLight: PointLight | null = null
    uiComponentList: QwetUiComponent[] = []

    constructor() {}

    init(): void {
        if (!this.object) throw new Error('Object is not initialized')

        this.pointLight = new PointLight(
            'PointLight',
            new Vector3(0, 0, 0),
            this.object.scene
        )
        this.object.uniqueId = this.pointLight.uniqueId

        this.uiComponentList.push(new BasicInspector(this))
    }

    update(): void {
        if (!this.object) throw new Error('Object is not initialized')
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



    ui(): JSX.Element {
        return <>{this.uiComponentList.map((uiComponent) => uiComponent)}</>
    }
}
