"use client"
import React from 'react'
import { useEffect } from 'react'
import { Engine } from "@babylonjs/core/Engines/engine";
import { Player } from "textalive-app-api";
import "babylon-mmd/esm/Loader/pmxLoader";
import HavokPhysics from "@babylonjs/havok";
import 'babylonjs-loaders';
import '@babylonjs/loaders'
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF/2.0"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';

import {
    ArcRotateCamera,
    DirectionalLight, FlyCamera, FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Vector3
} from "@babylonjs/core";
import {GLTFFileLoader} from "@babylonjs/loaders";
let TPlayer:Player

export default function MMD(){
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.position= "relative"

    const media = document.createElement("media");
    media.style.position = "absolute"
    media.style.zIndex = "1000"
    media.style.right = "0"
    media.style.bottom = "0"

    useEffect(() => {
        document.body.appendChild(media);
        document.body.appendChild(canvas);
        const engine = new Engine(canvas)

        vrm(engine,canvas).then(data => {
            console.log(data)
        })
    })

    return (
        <>
            <button onClick={() => {
               TPlayer.requestPlay()
            }}>aaaa
            </button>
            <button onClick={() => {
                TPlayer.requestPause()
            }}>bbbb
            </button>
            <button onClick={() => {
            }}>cccc
            </button>

            <style>
                button {
                    "position: absolute;z-index: 10000"
                }
            </style>
        </>
    )
}

async function vrm(engine:Engine,canvas: HTMLCanvasElement){
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new FlyCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.speed=0.1
    // This attaches the camera to the canvas
    camera.attachControl(true,canvas);
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    const mesh = await SceneLoader.ImportMeshAsync(null, "http://localhost:3000/", "testtukuyomi.glb", scene,null,".glb")



    scene.registerBeforeRender(function () {

    });

    engine.runRenderLoop(() => {
        scene.render();
    });
}
