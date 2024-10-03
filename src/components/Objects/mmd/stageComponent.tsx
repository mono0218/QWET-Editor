import { QwetComponent } from '@/types/component'
import { QwetObject } from '@/types/object'
import React from 'react'
import { Mesh, SceneLoader } from '@babylonjs/core'
import 'babylon-mmd/esm/Loader/Optimized/bpmxLoader'

export class StageComponent implements QwetComponent {
    object: QwetObject
    stageMesh: Mesh
    file: File

    constructor(mesh: Mesh | null = null, file: File | null = null) {
        if (!mesh && !file) throw new Error('mesh or file is required')

        if (mesh) {
            this.stageMesh = mesh
            this.initSet()
        } else if (file) {
            this.file = file
        }
    }

    initSet(): void {
        this.object.setPos(
            this.stageMesh.position.x,
            this.stageMesh.position.y,
            this.stageMesh.position.z
        )
        this.object.setRot(
            this.stageMesh.rotation.x,
            this.stageMesh.rotation.y,
            this.stageMesh.rotation.z
        )
        this.object.setScale(
            this.stageMesh.scaling.x,
            this.stageMesh.scaling.y,
            this.stageMesh.scaling.z
        )
    }

    init(): void {
        SceneLoader.ImportMeshAsync(
            '',
            this.file.name,
            this.file,
            this.object.scene
        ).then((result) => {
            this.stageMesh = result.meshes[0] as Mesh
            this.initSet()
        })
    }

    update(): void {
        const pos = this.object.position
        const rot = this.object.rotation
        const scale = this.object.scale

        this.stageMesh.position.set(pos.x, pos.y, pos.z)
        this.stageMesh.rotation.set(rot.x, rot.y, rot.z)
        this.stageMesh.scaling.set(scale.x, scale.y, scale.z)
    }

    destroy(): void {
        this.stageMesh.dispose()
    }

    ui(): React.JSX.Element {
        return <></>
    }
}
