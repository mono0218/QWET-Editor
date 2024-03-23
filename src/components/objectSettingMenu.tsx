import {AbstractMesh, Scene} from '@babylonjs/core'
import { useForm } from 'react-hook-form'
import changeTransport, { ITransport } from '../lib/object/Transports'
import { useEffect } from 'react'

export default function ObjectSettingMenu({
    scene,
    nodeId,
}: {
    scene: Scene
    nodeId: string
}) {
    if (!scene) return <></>

    const node = scene.getNodeById(nodeId)
    if (node === null) return <></>

    const meshes= node.getChildMeshes()

    let meshList: AbstractMesh[]
    if (meshes.length === 0) {
        meshList = [node as AbstractMesh]
    }else{
        meshList = meshes
    }

    if (meshList.length === 0) return <></>

    const { register, watch } = useForm()

    useEffect(() => {
        const subscription = watch((watchTransport) => {
            const transport: ITransport = {
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
            changeTransport(transport, meshList)
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
                                    defaultValue={meshList[0].position.x}
                                    {...register('px', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={meshList[0].position.y}
                                    {...register('py', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={meshList[0].position.z}
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
                                    defaultValue={meshList[0].rotation.x}
                                    {...register('rx', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={meshList[0].rotation.y}
                                    {...register('ry', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={meshList[0].rotation.z}
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
                                    defaultValue={meshList[0].scaling.x}
                                    {...register('sx', { required: true })}
                                    placeholder="X"
                                />
                                <input
                                    type="number"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={meshList[0].scaling.y}
                                    {...register('sy', { required: true })}
                                    placeholder="Y"
                                />
                                <input
                                    type="number"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={meshList[0].scaling.z}
                                    {...register('sz', { required: true })}
                                    placeholder="Z"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
