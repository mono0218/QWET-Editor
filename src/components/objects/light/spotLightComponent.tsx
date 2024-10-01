import { QwetComponent } from '@/types/component'
import React from 'react'
import { QwetObject } from '@/types/object'
import { SpotLight, Vector3 } from '@babylonjs/core'
import { BasicInspector } from '@/components/uiComponents/basicInspector'
import { QwetUiComponent } from '@/types/uiComponent'

export class SpotLightComponent implements QwetComponent {
    object: QwetObject | undefined
    light: SpotLight | null = null
    uiComponentList: QwetUiComponent[] = []
    init(): void {
        if (!this.object) throw new Error('Object is not initialized')
        this.light = new SpotLight(
            'SpotLight',
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            0,
            0,
            this.object.scene
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
        this.light.direction = new Vector3(
            this.object.rotation.x,
            this.object.rotation.y,
            this.object.rotation.z
        )
    }

    destroy(): void {
        if (!this.light) throw new Error('Light is not initialized')

        this.light.dispose()
    }

    ui(): JSX.Element {
        return <>{this.uiComponentList.map((uiComponent) => uiComponent)}</>
    }
}
