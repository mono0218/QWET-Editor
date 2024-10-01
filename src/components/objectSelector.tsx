import { QwetEditor } from '@/components/Editor'
import { useState } from 'react'
import { QwetObject } from '@/types/object'

export default function ObjectSelector({
    editor,
    handleObjectSelect,
}: {
    editor: QwetEditor
    handleObjectSelect: (uniqueId: number) => void
}) {
    const [objectList, setObjList] = useState<Array<QwetObject>>(
        editor.objectList
    )

    setInterval(() => {
        const objectArray = editor.objectList.filter(
            (i) => objectList.indexOf(i) == -1
        )
        setObjList([...objectList, ...objectArray])
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
                        {objectList.map((object) => {
                            return (
                                <li className="mb-2" key={object.uniqueId!}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleObjectSelect(object.uniqueId!)
                                        }}
                                    >
                                        {object.name}
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
