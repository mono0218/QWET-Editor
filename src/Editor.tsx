import React, { useEffect, useState } from 'react'
import ObjectSelector from './components/objectSelector'
import ObjectSettingMenu from './components/objectSettingMenu'
import './global.css'
import LiveEngine from './lib/LiveEngine'
import { Scene } from '@babylonjs/core'

export default function Editor() {
    const [loading, setLoading] = useState(true)
    const [scene, setScene] = useState<Scene>()
    const [selectedObj, setSelectedObj] = useState('')

    useEffect(() => {
        const [engine, scene] = LiveEngine()
        setScene(scene)
        setLoading(false)
        engine.runRenderLoop(() => {
            scene.render()
        })
    }, [])

    const handleObjectSelect = (meshId: string) => {
        setSelectedObj(meshId)
    }

    return (
        <div className="flex">
            {loading ? (
                <div className="w-72">Loading...</div>
            ) : (
                <ObjectSelector
                    scene={scene!}
                    onObjectSelect={handleObjectSelect}
                />
            )}

            <canvas className="w-full" />

            {loading ? (
                <div className="w-72">Loading...</div>
            ) : (
                <ObjectSettingMenu scene={scene!} meshId={selectedObj} />
            )}
        </div>
    )
}
