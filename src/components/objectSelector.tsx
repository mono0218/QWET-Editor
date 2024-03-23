import {Node, Scene} from "@babylonjs/core";
import {useState} from "react";

export default function ObjectSelector({
    scene,
    onObjectSelect,
}: {
    scene: Scene
    onObjectSelect: (meshId: string) => void
}) {

    if (!scene) return <></>
    const [nodeList, setNodeList] = useState<Node[]>(scene.rootNodes)

    scene.onNewMeshAddedObservable.add(() => {
        setTimeout(() => {
            setNodeList(scene.rootNodes)
        },1000)
    })

    const handleObjectClick = (nodeId: string) => {
        onObjectSelect(nodeId)
    }

    if(nodeList.length === 0) return <></>

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
                        {nodeList.map((node:Node) => (
                            <li className="mb-2" key={node.id}>
                                <div
                                    className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600"
                                    onClick={() => {
                                        handleObjectClick(node.id)
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
