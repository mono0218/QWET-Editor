import { Scene, TransformNode } from '@babylonjs/core'
import { useState } from 'react'
import { tfNodeManager } from '../lib/manager/tfNodeManager'

export default function ObjectSelector({
    scene,
    nodeManager,
    onObjectSelect,
}: {
    scene: Scene
    nodeManager: tfNodeManager
    onObjectSelect: (meshId: number) => void
}) {
    if (!scene) return <></>
    const [nodeList, setNodeList] = useState<TransformNode[]>(
        nodeManager.getNodeList()
    )

    scene.onNewTransformNodeAddedObservable.add(() => {
        setTimeout(() => {
            setNodeList([...nodeManager.getNodeList()])
        }, 1000)
    })

    const handleObjectClick = (uniqueId: number) => {
        onObjectSelect(uniqueId)
    }

    return (
        <>
            <div className="w-72 bg-gray-800 p-4 text-white">
                <div className="mb-4 flex">
                    <button className="flex-1 rounded-md bg-transparent px-4 py-2 hover:bg-gray-700 focus:outline-none">
                        Scene
                    </button>
                </div>
                <div className="p-4">
                    <ul className="m-0 list-none p-0">
                        {nodeList.map((node: TransformNode) => (
                            <li className="mb-2" key={node.uniqueId}>
                                <div
                                    className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600"
                                    onClick={() => {
                                        handleObjectClick(node.uniqueId)
                                    }}
                                >
                                    <span className="font-bold">
                                        {node.name}
                                    </span>
                                    <button className="focus:outline-none">
                                        &#9660;
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
