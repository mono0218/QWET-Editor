import React, { useEffect, useState } from 'react'
import ObjectSelector from './components/objectSelector'
import ObjectSettingMenu from './components/objectSettingMenu'
import './global.css'
import LiveEngine from './lib/LiveEngine'
import {Scene} from '@babylonjs/core'
import Header from './components/header'

export default function Editor() {
    const [scene, setScene] = useState<Scene>()
    const [selectedObj, setSelectedObj] = useState('')

    useEffect(() => {
        const scene: Scene = LiveEngine()
        setScene(scene)
    }, [])

    const handleObjectSelect = (nodeId: string) => {
        setSelectedObj(nodeId)
    }

    return (
        <>
            {scene ? <Header scene={scene} />: <> </>}
            <div className="flex">
                {scene ? (
                    <ObjectSelector
                        scene={scene}
                        onObjectSelect={handleObjectSelect}
                    />
                ) : (
                    <div className="w-72">Loading...</div>
                )}

                <canvas className="w-full" />

                {scene ? (
                    <ObjectSettingMenu scene={scene} nodeId={selectedObj}/>
                ) : (
                    <div className="w-72">Loading...</div>
                )}
            </div>
        </>
    )
}
