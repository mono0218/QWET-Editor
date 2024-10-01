import { HemisphericLight, Vector3 } from '@babylonjs/core'
import { QwetObject } from '@/types/object'
import { QwetComponent } from '@/types/component'
import { BasicInspector } from '@/components/uiComponents/basicInspector'
import { QwetUiComponent } from '@/types/uiComponent'

export class HemisphericLightComponent implements QwetComponent {
    object: QwetObject | undefined
    light: HemisphericLight | null = null
    uiComponentList: QwetUiComponent[] = []

    constructor() {}

    init(): void {
        if (!this.object) throw new Error('Object is not initialized')

        this.light = new HemisphericLight(
            'HemisphericLight',
            new Vector3(0, 0, 0),
            this.object.scene
        )
        this.object.uniqueId = this.light.uniqueId

        this.uiComponentList.push(new BasicInspector(this))
    }

    update(): void {}

    destroy(): void {
        if (!this.light) throw new Error('Light is not initialized')
        this.light.dispose()
    }

    ui(): JSX.Element {
        return <>{this.uiComponentList.map((uiComponent) => uiComponent)}</>
    }
}
