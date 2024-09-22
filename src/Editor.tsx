import React, { useEffect, useState } from 'react'
import ObjectSelector from './components/objectSelector'
import ObjectSettingMenu from './components/objectSettingMenu'
import Header from './components/header'
import { QwetEditer } from './lib/Editer'
import './global.css'

export default function Editor() {
    const [editer, setEditer] = useState<QwetEditer>()
    const [selectedObj, setSelectedObj] = useState<number>(0)

    useEffect(() => {
        setEditer(new QwetEditer())
    }, [])

    const handleObjectSelect = (uniqueId: number) => {
        setSelectedObj(uniqueId)
    }

    return (
        <>
            {editer ? <Header editer={editer} /> : <div>Loading...</div>}

            <div className="flex">
                {editer ? (
                    <ObjectSelector
                        editer={editer}
                        handleObjectSelect={handleObjectSelect}
                    />
                ) : (
                    <div>Loading...</div>
                )}

                <canvas className="w-2/3" />
                {editer ? (
                    <ObjectSettingMenu editer={editer} uniqueId={selectedObj} />
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </>
    )
}
