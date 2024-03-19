import {Scene} from "@babylonjs/core";

export default function ObjectSettingMenu({scene,meshId}:{scene:Scene,meshId:string}){
    const mesh = scene.getMeshById(meshId)
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
                                    type="text"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.position.x}
                                    placeholder="X"
                                />
                                <input
                                    type="text"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.position.y}
                                    placeholder="Y"
                                />
                                <input
                                    type="text"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.position.z}
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
                                    type="text"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.rotation.x}
                                    placeholder="X"
                                />
                                <input
                                    type="text"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.rotation.y}
                                    placeholder="Y"
                                />
                                <input
                                    type="text"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.rotation.z}
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
                                    type="text"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.scaling.x}
                                    placeholder="X"
                                />
                                <input
                                    type="text"
                                    className="mr-2 w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.scaling.y}
                                    placeholder="Y"
                                />
                                <input
                                    type="text"
                                    className="w-16 border border-gray-600 bg-gray-700 px-2 py-1"
                                    defaultValue={mesh?.scaling.z}
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
