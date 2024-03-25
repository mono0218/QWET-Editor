import React, { useEffect, useState } from 'react'
import ObjectSelector from './components/objectSelector'
import ObjectSettingMenu from './components/objectSettingMenu'
import './global.css'
import LiveEngine from './lib/LiveEngine'
import { Scene } from '@babylonjs/core'
import Header from './components/header'
import { tfNodeManager } from './lib/manager/tfNodeManager'

export default function Editor() {
    const [scene, setScene] = useState<Scene>()
    const [selectedObj, setSelectedObj] = useState<number>(0)
    const [nodeManager, setNodeManager] = useState<tfNodeManager>()

    useEffect(() => {
        const scene: Scene = LiveEngine()
        setNodeManager(new tfNodeManager())
        setScene(scene)
    }, [])

    const handleObjectSelect = (uniqueId: number) => {
        setSelectedObj(uniqueId)
    }

    return (
        <>
            {scene ? (
                <Header scene={scene} nodeManager={nodeManager!} />
            ) : (
                <> </>
            )}
            <div className="flex">
                {scene ? (
                    <ObjectSelector
                        scene={scene}
                        nodeManager={nodeManager!}
                        onObjectSelect={handleObjectSelect}
                    />
                ) : (
                    <div className="w-72">Loading...</div>
                )}

                <canvas className="w-full" />

                {scene ? (
                    <ObjectSettingMenu
                        nodeManager={nodeManager!}
                        uniqueId={selectedObj}
                    />
                ) : (
                    <div className="w-72">Loading...</div>
                )}
            </div>
        </>
    )
}
