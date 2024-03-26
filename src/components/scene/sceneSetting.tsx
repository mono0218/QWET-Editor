import { useForm } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Scene, SceneLoader, TransformNode, Vector3 } from '@babylonjs/core'
import { getParent } from '../../lib/object/getParent'
import { VRMFileLoader } from '../../lib/object/vrmLoader'

export default function SceneSetting({ scene }: { scene: Scene }) {
    const PlayerStart = scene.getTransformNodeByName('PlayerStartPosition')
    const LiverStart = scene.getTransformNodeByName('LiverStartPosition')
    if (!PlayerStart || !LiverStart) {
        alert('PlayerStartPosition or LiverStartPosition not found')
        return <> </>
    }

    useEffect(() => {
        SceneLoader.RegisterPlugin(new VRMFileLoader())
    }, [])

    const { register, watch } = useForm()

    useEffect(() => {
        const subscription = watch((watchTransport) => {
            PlayerStart.position = new Vector3(
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

    const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        console.log(event.currentTarget.id)
        if (!files || files?.length === 0) return

        const file = files[0]

        if (event.currentTarget.id === 'ListenerAvatarInput') {
            const listenerAvatar = new TransformNode('ListenerAvatar', scene)
            SceneLoader.ImportMeshAsync('', '', file, scene).then((result) => {
                getParent(result.meshes[0]).parent = listenerAvatar
                listenerAvatar.position = new Vector3(10000, 10000, 10000)
            })
        } else if (event.currentTarget.id === 'LiverAvatarInput') {
            const liverAvatar = new TransformNode('LiverAvatar', scene)
            SceneLoader.ImportMeshAsync('', '', file, scene).then((result) => {
                getParent(result.meshes[0]).parent = liverAvatar
                liverAvatar.position = new Vector3(10000, 10000, 10000)
            })
        }
    }

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
                                    defaultValue={PlayerStart.position.x}
                                    {...register('px', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={PlayerStart.position.y}
                                    {...register('py', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={PlayerStart.position.z}
                                    {...register('pz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                        <input
                            type="file"
                            id="ListenerAvatarInput"
                            style={{ display: 'none' }}
                            onChange={onFile}
                        />
                        <label
                            htmlFor="ListenerAvatarInput"
                            className="flex items-center px-4 py-2 bg-gray-600 rounded-md cursor-pointer hover:bg-gray-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            SetListenerAvatar
                        </label>
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
                        <input
                            type="file"
                            id="LiverAvatarInput"
                            style={{ display: 'none' }}
                            onChange={onFile}
                        />
                        <label
                            htmlFor="LiverAvatarInput"
                            className="flex items-center px-4 py-2 bg-gray-600 rounded-md cursor-pointer hover:bg-gray-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            SetLiverAvatar
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}
