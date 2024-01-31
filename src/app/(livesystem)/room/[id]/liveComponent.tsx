"use client"
import React from 'react'
import {useEffect} from 'react'
import {Engine} from "@babylonjs/core/Engines/engine";
import "babylon-mmd/esm/Loader/pmxLoader";
import '@babylonjs/loaders'
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF/2.0"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import {Inspector} from '@babylonjs/inspector';
import {DirectionalLight, FlyCamera, Scene, Vector3} from "@babylonjs/core";
import '@babylonjs/inspector'
import {songleController} from "@/lib/songle/songleController";
import {assetLoader} from "@/lib/vrm/assetLoader";

export type liveProps = {
    uuid: string
    modelUrl: string;
    motionUrl: string;
    stageUrl: string;
    movieUrl: string;

    accessToken: string;
    secretToken?: string;
}

let liveData: liveProps
let scene: Scene

export default function LiveComponent(data: liveProps) {
    liveData = data
    useEffect(() => {
        const canvas: HTMLCanvasElement = document.getElementsByTagName("canvas")[0]
        const engine = new Engine(canvas)

        vrm(engine).then(scene => {
            songleController(scene,liveData.accessToken,liveData.secretToken,liveData.movieUrl).then(() => {
                    engine.runRenderLoop(() => {
                        scene.render();
                    });
                }
            )
        })
    }, [])

    return (
        <>
            <div className="media"></div>

            <canvas id="canvas" className="w-screen w-screen"></canvas>

            <style>
                button {
                "position: absolute;z-index: 10000"
            }
            </style>
        </>
    )
}

async function vrm(engine: Engine) {
    scene = new Scene(engine);
    const camera = new FlyCamera("camera1", new Vector3(0, 2, -2), scene);
    camera.attachControl(true)
    camera.speed = 0.1

    const light = new DirectionalLight("DirectionalLight", new Vector3(0, 3, 0), scene);
    light.intensity = 10.0;
    camera.checkCollisions = true
    camera.ellipsoid = new Vector3(1, 1, 1,)

    await assetLoader(liveData,scene)
    await scene.createDefaultXRExperienceAsync();

    Inspector.Show(scene,{});

    return scene
}


