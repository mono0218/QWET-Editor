import {QwetEditer} from "../lib/Editer";
import {MmdModel} from "babylon-mmd";
import {useState} from "react";

export default function ObjectSelector({
    editer,
   handleObjectSelect
}: {
    editer: QwetEditer
    handleObjectSelect: (uniqueId: number) => void
}) {
    const [ojbList, setObjList] = useState<MmdModel[]>(editer.mmdManager.allList)
    const [lightList, setLightList] = useState(editer.lightManager.allLight)
    setInterval(() => {
        const array = editer.mmdManager.allList.filter(i => ojbList.indexOf(i) == -1)
        setObjList([...ojbList,...array])

        const lightArray = editer.lightManager.allLight.filter(i => lightList.indexOf(i) == -1)
        setLightList([...lightList,...lightArray])
    },1000)
    return (
        <>
            <div className="w-72 bg-gray-800 p-4 text-white">
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
                            return(
                                <li className="mb-2" key={mmd.mesh.uniqueId}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleObjectSelect(mmd.mesh.uniqueId)
                                        }}
                                    >
                                        {mmd.mesh.name}
                                    </button>
                                </li>
                            )
                        })}
                        {lightList.map((light ) => {
                            return(
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
                    </ul>
                </div>
            </div>
        </>
    )
}
