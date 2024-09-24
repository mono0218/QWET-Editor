import { HemisphericLight, Vector3 } from '@babylonjs/core'
import { QwetObject } from '@/types/object'
import { QwetComponent } from '@/types/component'

export class HemisphericLightComponent implements QwetComponent {
    object: QwetObject
    light: HemisphericLight | null = null

    constructor() {}

    init(): void {
        this.light = new HemisphericLight(
            'HemisphericLight',
            new Vector3(0, 0, 0),
            this.object.scene
        )
    }

    update(): void {}

    destroy(): void {
        if (!this.light) throw new Error('Light is not initialized')
        this.light.dispose()
    }

    ui(): JSX.Element {
        return <></>
    }
}
