import React, { useEffect, useState } from 'react'
import ObjectSelector from './components/objectSelector'
import ObjectSettingMenu from './components/objectSettingMenu'
import './global.css'
import LiveEngine from './lib/LiveEngine'
import { Scene } from '@babylonjs/core'
import Header from "./components/header";

export default function Editor() {
    const [loading, setLoading] = useState(true)
    const [scene, setScene] = useState<Scene>()
    const [selectedObj, setSelectedObj] = useState('')

    useEffect(() => {
        const scene:Scene = LiveEngine()
        setScene(scene)
        setLoading(false)
    }, [])

    useEffect(() => {
        console.log(scene?.meshes)
    }, [scene?.meshes])

    const handleObjectSelect = (meshId: string) => {
        setSelectedObj(meshId)
    }

    return (
        <>
            {loading ? (<></>) : (
                <Header scene={scene!}/>
            )}
            <div className="flex">
                {loading ? (<div className="w-72">Loading...</div>) : (
                    <ObjectSelector
                        scene={scene!}
                        onObjectSelect={handleObjectSelect}
                    />
                )}

                <canvas className="w-full"/>

                {loading ? (
                    <div className="w-72">Loading...</div>
                ) : (
                    <ObjectSettingMenu scene={scene!} meshId={selectedObj}/>
                )}
            </div>
        </>

    )
}
