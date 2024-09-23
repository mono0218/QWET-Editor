import { QwetEditor } from '@/lib/Editor'
import { MmdModel } from 'babylon-mmd'
import { useState } from 'react'

export default function ObjectSelector({
    editor,
    handleObjectSelect,
}: {
    editor: QwetEditor
    handleObjectSelect: (uniqueId: number) => void
}) {
    const [ojbList, setObjList] = useState<MmdModel[]>(
        editor.mmdManager.allList
    )
    const [lightList, setLightList] = useState(editor.lightManager.allLight)
    const [meshList, setMeshList] = useState(editor.meshManager.allMeshs)
    setInterval(() => {
        const array = editor.mmdManager.allList.filter(
            (i) => ojbList.indexOf(i) == -1
        )
        setObjList([...ojbList, ...array])

        const lightArray = editor.lightManager.allLight.filter(
            (i) => lightList.indexOf(i) == -1
        )
        setLightList([...lightList, ...lightArray])

        const meshArray = editor.meshManager.allMeshs.filter(
            (i) => meshList.indexOf(i) == -1
        )
        setMeshList([...meshList, ...meshArray])
    }, 1000)
    return (
        <>
            <div className="w-full bg-gray-800 p-4 text-white">
                <div className="mb-4 flex">
                    <button
                        className="flex-1 rounded-md bg-transparent px-4 py-2 hover:bg-gray-700 focus:outline-none"
                        onClick={() => {
                            handleObjectSelect(0)
                        }}
                    >
                        Scene
                    </button>
                </div>
                <div className="p-4">
                    <ul className="m-0 list-none p-0">
                        {ojbList.map((mmd: MmdModel) => {
                            return (
                                <li className="mb-2" key={mmd.mesh.uniqueId}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleObjectSelect(
                                                mmd.mesh.uniqueId
                                            )
                                        }}
                                    >
                                        {mmd.mesh.name}
                                    </button>
                                </li>
                            )
                        })}
                        {lightList.map((light) => {
                            return (
                                <li className="mb-2" key={light.uniqueId}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleObjectSelect(light.uniqueId)
                                        }}
                                    >
                                        {light.name}
                                    </button>
                                </li>
                            )
                        })}
                        {meshList.map((object) => {
                            return (
                                <li className="mb-2" key={object.mesh.uniqueId}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleObjectSelect(
                                                object.mesh.uniqueId
                                            )
                                        }}
                                    >
                                        {object.mesh.name}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}
