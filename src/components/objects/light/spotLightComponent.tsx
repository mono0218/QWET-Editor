import { QwetComponent } from '@/types/component'
import React from 'react'
import { QwetObject } from '@/types/object'
import { SpotLight, Vector3 } from '@babylonjs/core'
import { basicInspector } from '@/components/uiComponents/basicInspector'

export class SpotLightComponent implements QwetComponent {
    object: QwetObject
    light: SpotLight | null = null
    init(): void {
        this.light = new SpotLight(
            'SpotLight',
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            0,
            0,
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

    uiComponentList: JSX.Element[] = []

    ui(): JSX.Element {
        return <>{this.uiComponentList.map((uiComponent) => uiComponent)}</>
    }
}
