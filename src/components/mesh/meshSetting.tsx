import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { AbstractMesh } from '@babylonjs/core'
import changeMeshTransport, {
    IMeshTransport,
} from '../../lib/object/meshTransports'
import { QwetEditer } from '@/lib/Editer'
import OpenTextEditor from '@/components/monaco/TextEditor'
import openTextEditor from '@/components/monaco/TextEditor'
import MonacoEditor from 'react-monaco-editor'

export default function MeshSetting({
    mesh,
    editer,
}: {
    mesh: AbstractMesh
    editer: QwetEditer
}) {
    if (!mesh) return <></>

    const { register, watch, setValue } = useForm()

    useEffect(() => {
        const subscription = watch((watchTransport) => {
            const transport: IMeshTransport = {
                px: watchTransport.px,
                py: watchTransport.py,
                pz: watchTransport.pz,
                rx: watchTransport.rx,
                ry: watchTransport.ry,
                rz: watchTransport.rz,
                sx: watchTransport.sx,
                sy: watchTransport.sy,
                sz: watchTransport.sz,
            }
            changeMeshTransport(transport, mesh)
        })
        return () => subscription.unsubscribe()
    }, [watch, mesh])

    useEffect(() => {
        setValue('px', mesh.position.x)
        setValue('py', mesh.position.y)
        setValue('pz', mesh.position.z)
        setValue('rx', mesh.rotation.x)
        setValue('ry', mesh.rotation.y)
        setValue('rz', mesh.rotation.z)
        setValue('sx', mesh.scaling.x)
        setValue('sy', mesh.scaling.y)
        setValue('sz', mesh.scaling.z)
    }, [mesh])

    return (
        <>
            <div className="w-72 bg-gray-800 p-4 text-white">
                <div className="mb-4 bg-gray-700 px-4 py-2 font-bold">
                    Inspector
                </div>
                <div className="mb-4 rounded-md border border-gray-600 bg-gray-700">
                    <div className="flex cursor-pointer items-center justify-between bg-gray-600 px-4 py-2">
                        <span className="flex-1 px-2 py-1 font-bold">
                            {' '}
                            Transports{' '}
                        </span>
                        <button className="focus:outline-none">&#9660;</button>
                    </div>
                    <div className="p-4">
                        <div className="mb-4">
                            <label className="mb-2 block font-bold">
                                Position
                            </label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.position.x}
                                    {...register('px', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.position.y}
                                    {...register('py', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.position.z}
                                    {...register('pz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="mb-2 block font-bold">
                                Rotation
                            </label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.rotation.x}
                                    {...register('rx', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.rotation.y}
                                    {...register('ry', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.rotation.z}
                                    {...register('rz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="mb-2 block font-bold">
                                Scale
                            </label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.scaling.x}
                                    {...register('sx', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.scaling.y}
                                    {...register('sy', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh.scaling.z}
                                    {...register('sz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {editer.meshManager.getMeshByUniqueID(mesh.uniqueId) ? (
                    <div className="mb-4">
                        <div className="flex cursor-pointer items-center justify-between bg-gray-600 px-4 py-2">
                            <span className="flex-1 px-2 py-1 font-bold">
                                {' '}
                                Shader Editor{' '}
                            </span>
                            <button className="focus:outline-none">
                                &#9660;
                            </button>
                        </div>
                        <label
                            className="flex items-center px-4 py-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                            onClick={() =>
                                openTextEditor(
                                    editer.meshManager.getMeshByUniqueID(
                                        mesh.uniqueId
                                    )!
                                )
                            }
                        >
                            Open Editor
                        </label>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
