import { QwetObject } from '@/types/object'
import { Mesh, SceneLoader } from '@babylonjs/core'
import { QwetComponent } from '@/types/component'
import React, { JSX, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import 'babylon-mmd/esm/Loader/Optimized/bpmxLoader'

export class AvatarComponent implements QwetComponent {
    object: QwetObject
    mmdMesh: Mesh
    file: File

    constructor(mesh: Mesh | null = null, file: File | null = null) {
        if (!mesh && !file) throw new Error('mesh or file is required')

        if (mesh) {
            this.mmdMesh = mesh
            this.initSet()
        } else if (file) {
            this.file = file
        }
    }

    init(): void {
        SceneLoader.ImportMeshAsync(
            '',
            this.file.name,
            this.file,
            this.object.scene
        ).then((result) => {
            this.mmdMesh = result.meshes[0] as Mesh
            this.initSet()
        })
    }

    private initSet() {
        this.object.setPos(
            this.mmdMesh.position.x,
            this.mmdMesh.position.y,
            this.mmdMesh.position.z
        )
        this.object.setRot(
            this.mmdMesh.rotation.x,
            this.mmdMesh.rotation.y,
            this.mmdMesh.rotation.z
        )
        this.object.setScale(
            this.mmdMesh.scaling.x,
            this.mmdMesh.scaling.y,
            this.mmdMesh.scaling.z
        )
    }

    update(): void {
        const pos = this.object.position
        const rot = this.object.rotation
        const scale = this.object.scale

        this.mmdMesh.position.set(pos.x, pos.y, pos.z)
        this.mmdMesh.rotation.set(rot.x, rot.y, rot.z)
        this.mmdMesh.scaling.set(scale.x, scale.y, scale.z)
    }

    destroy(): void {
        this.mmdMesh.dispose()
    }

    ui(): JSX.Element {
        const { register, watch, setValue } = useForm()

        useEffect(() => {
            const subscription = watch((values) => {
                const { px, py, pz, rx, ry, rz, sx, sy, sz } = values

                this.object.setPos(px, py, pz)
                this.object.setRot(rx, ry, rz)
                this.object.setScale(sx, sy, sz)
                this.update()
            })
            return () => subscription.unsubscribe()
        }, [watch])

        useEffect(() => {
            const { position, rotation, scale } = this.object
            setValue('px', position.x)
            setValue('py', position.y)
            setValue('pz', position.z)
            setValue('rx', rotation.x)
            setValue('ry', rotation.y)
            setValue('rz', rotation.z)
            setValue('sx', scale.x)
            setValue('sy', scale.y)
            setValue('sz', scale.z)
        }, [])

        return (
            <div className="w-full bg-gray-800 p-4 text-white">
                <div className="mb-4 bg-gray-700 px-4 py-2 font-bold">
                    Inspector
                </div>
                <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
                    {['Position', 'Rotation', 'Scale'].map((label, i) => (
                        <div key={i} className="mb-4">
                            <label className="mb-2 block font-bold">
                                {label}
                            </label>
                            <div className="flex">
                                {['x', 'y', 'z'].map((axis) => (
                                    <input
                                        key={axis}
                                        type="number"
                                        className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                        {...register(
                                            `${label[0].toLowerCase()}${axis}`,
                                            { required: true }
                                        )}
                                        placeholder={axis.toUpperCase()}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
