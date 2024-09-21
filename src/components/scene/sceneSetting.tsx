import { useForm } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Scene, Vector3 } from '@babylonjs/core'

export default function SceneSetting({ scene }: { scene: Scene }) {
    const ListenerStart = scene.getTransformNodeByName('ListenerStartPosition')
    const LiverStart = scene.getTransformNodeByName('LiverStartPosition')
    if (!ListenerStart || !LiverStart) {
        alert('PlayerStartPosition or LiverStartPosition not found')
        return <> </>
    }

    const { register, watch } = useForm()

    useEffect(() => {
        const subscription = watch((watchTransport) => {
            ListenerStart.position = new Vector3(
                watchTransport.px,
                watchTransport.py,
                watchTransport.pz
            )
            LiverStart.position = new Vector3(
                watchTransport.lx,
                watchTransport.ly,
                watchTransport.lz
            )
        })
        return () => subscription.unsubscribe()
    }, [watch])

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
                            ListenerStartPosition{' '}
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
                                    defaultValue={ListenerStart.position.x}
                                    {...register('px', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={ListenerStart.position.y}
                                    {...register('py', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={ListenerStart.position.z}
                                    {...register('pz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 rounded-md border border-gray-600 bg-gray-700">
                    <div className="flex cursor-pointer items-center justify-between bg-gray-600 px-4 py-2">
                        <span className="flex-1 px-2 py-1 font-bold">
                            {' '}
                            LiverStartPosition{' '}
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
                                    defaultValue={LiverStart.position.x}
                                    {...register('lx', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={LiverStart.position.y}
                                    {...register('ly', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={LiverStart.position.z}
                                    {...register('lz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 bg-gray-700 px-4 py-2 font-bold">
                    PostProcessing
                </div>
            </div>
        </>
    )
}
