import { useForm } from 'react-hook-form'
import React, { useEffect, useRef } from 'react'
import { QwetComponent } from '@/types/component'
import { QwetUiComponent } from '@/types/uiComponent'

interface FormValues {
    px: number
    py: number
    pz: number
    rx: number
    ry: number
    rz: number
    sx: number
    sy: number
    sz: number
}

export class BasicInspector implements QwetUiComponent {
    component: QwetComponent
    constructor(component: QwetComponent) {
        this.component = component
    }

    getUI(): JSX.Element {
        if (!this.component.object) throw new Error('Object is not initialized')
        const form = useForm()
        const { register, watch, setValue } = form
        const objectRef = useRef({
            position: {
                x: this.component.object.position.x,
                y: this.component.object.position.y,
                z: this.component.object.position.z,
            },
            rotation: {
                x: this.component.object.rotation.x,
                y: this.component.object.rotation.y,
                z: this.component.object.rotation.z,
            },
            scale: {
                x: this.component.object.scale.x,
                y: this.component.object.scale.y,
                z: this.component.object.scale.z,
            },
            setPos: (x: number, y: number, z: number) => {
                if (!this.component.object)
                    throw new Error('Object is not initialized')
                this.component.object.setPos(x, y, z)
                this.component.update()
            },
            setRot: (x: number, y: number, z: number) => {
                if (!this.component.object)
                    throw new Error('Object is not initialized')
                this.component.object.setRot(x, y, z)
                this.component.update()
            },
            setScale: (x: number, y: number, z: number) => {
                if (!this.component.object)
                    throw new Error('Object is not initialized')
                this.component.object.setScale(x, y, z)
                this.component.update()
            },
        })

        const updateObject = (values: FormValues) => {
            const { px, py, pz, rx, ry, rz, sx, sy, sz } = values
            objectRef.current.setPos(px, py, pz)
            objectRef.current.setRot(rx, ry, rz)
            objectRef.current.setScale(sx, sy, sz)
        }

        useEffect(() => {
            if (!this.component.object)
                throw new Error('Object is not initialized')
            objectRef.current = {
                position: {
                    x: this.component.object.position.x,
                    y: this.component.object.position.y,
                    z: this.component.object.position.z,
                },
                rotation: {
                    x: this.component.object.rotation.x,
                    y: this.component.object.rotation.y,
                    z: this.component.object.rotation.z,
                },
                scale: {
                    x: this.component.object.scale.x,
                    y: this.component.object.scale.y,
                    z: this.component.object.scale.z,
                },
                setPos: (x: number, y: number, z: number) => {
                    if (!this.component.object)
                        throw new Error('Object is not initialized')
                    this.component.object.setPos(x, y, z)
                    this.component.update()
                },
                setRot: (x: number, y: number, z: number) => {
                    if (!this.component.object)
                        throw new Error('Object is not initialized')
                    this.component.object.setRot(x, y, z)
                    this.component.update()
                },
                setScale: (x: number, y: number, z: number) => {
                    if (!this.component.object)
                        throw new Error('Object is not initialized')
                    this.component.object.setScale(x, y, z)
                    this.component.update()
                },
            } // リセット
        }, [this.component])

        useEffect(() => {
            const subscription = watch((values) => {
                updateObject(values)
            })
            return () => subscription.unsubscribe()
        }, [watch])

        useEffect(() => {
            const { position, rotation, scale } = objectRef.current
            setValue('px', position.x)
            setValue('py', position.y)
            setValue('pz', position.z)
            setValue('rx', rotation.x)
            setValue('ry', rotation.y)
            setValue('rz', rotation.z)
            setValue('sx', scale.x)
            setValue('sy', scale.y)
            setValue('sz', scale.z)
        }, [this.component])

        return (
            <div className="w-72 bg-gray-800 p-4 text-white">
                <div className="mb-4 bg-gray-700 px-4 py-2 font-bold">
                    Inspector {this.component.object.uniqueId}
                </div>
                <div className="mb-4 rounded-md border border-gray-600 bg-gray-700">
                    <div className="flex items-center justify-between bg-gray-600 px-4 py-2">
                        <span className="flex-1 px-2 py-1 font-bold">
                            Transports
                        </span>
                        <button className="focus:outline-none">&#9660;</button>
                    </div>
                    <div className="p-4">
                        {['Position', 'Rotation', 'Scale'].map(
                            (label, index) => (
                                <div key={index} className="mb-4">
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
                                                    `${label.toLowerCase().charAt(0)}${axis}`,
                                                    { required: true }
                                                )}
                                                placeholder={axis.toUpperCase()}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
