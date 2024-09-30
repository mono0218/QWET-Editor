import { useForm } from 'react-hook-form'
import React, { useEffect, useRef } from 'react'
import { QwetComponent } from '@/types/component'

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

export function basicInspector(component: QwetComponent) {
    const { register, watch, setValue } = useForm()
    const objectRef = useRef({
        position: {
            x: component.object.position.x,
            y: component.object.position.y,
            z: component.object.position.z,
        },
        rotation: {
            x: component.object.rotation.x,
            y: component.object.rotation.y,
            z: component.object.rotation.z,
        },
        scale: {
            x: component.object.scale.x,
            y: component.object.scale.y,
            z: component.object.scale.z,
        },
        setPos: (x: number, y: number, z: number) => {
            component.object.setPos(x, y, z)
            component.update()
        },
        setRot: (x: number, y: number, z: number) => {
            component.object.setRot(x, y, z)
            component.update()
        },
        setScale: (x: number, y: number, z: number) => {
            component.object.setScale(x, y, z)
            component.update()
        },
    })

    const updateObject = (values: FormValues) => {
        const { px, py, pz, rx, ry, rz, sx, sy, sz } = values
        objectRef.current.setPos(px, py, pz)
        objectRef.current.setRot(rx, ry, rz)
        objectRef.current.setScale(sx, sy, sz)
    }

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
    }, [])

    return (
        <React.Fragment key={component.object.uniqueId}>
            <div className="w-72 bg-gray-800 p-4 text-white">
                <div className="mb-4 bg-gray-700 px-4 py-2 font-bold">
                    Inspector
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
        </React.Fragment>
    )
}
