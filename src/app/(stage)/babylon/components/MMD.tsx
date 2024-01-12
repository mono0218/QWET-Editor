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
import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';

import {
    FlyCamera,
    Scene,
    Vector3
} from "@babylonjs/core";
import {GLTFFileLoader} from "@babylonjs/loaders";
import '@babylonjs/inspector';
import {Inspector} from "@babylonjs/inspector";
let TPlayer:Player

export default function MMD(){


    useEffect(() => {
        const canvas:HTMLElement = document.getElementById("canvas")
        const edit = document.getElementById("edit")
        const engine = new Engine(canvas)

        vrm(engine,canvas).then(data => {
            console.log(data)
        })
    })

    return (
        <>
            <button onClick={() => {

            }}>aaaa
            </button>
            <button onClick={() => {
                TPlayer.requestPause()
            }}>bbbb
            </button>
            <button onClick={() => {
            }}>cccc
            </button>

            <canvas id="canvas" className="w-full h-full"></canvas>

            <style>
                button {
                "position: absolute;z-index: 10000"
            }
            </style>
        </>
    )
}

export class VRMFileLoader extends GLTFFileLoader {
    public name = 'vrm';
    public extensions = {
        '.vrm': { isBinary: true },
    };

    public createPlugin() {
        return new VRMFileLoader();
    }
}

async function vrm(engine:Engine,canvas: HTMLCanvasElement){
    const scene = new Scene(engine);

    const camera = new FlyCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.speed=0.1
    camera.attachControl(true,canvas);

    SceneLoader.RegisterPlugin(new VRMFileLoader());
    SceneLoader.Append("http://localhost:3000/","a.vrm",scene)

    SceneLoader.Append("http://localhost:3000/", "aipai.glb")

    console.log(scene)
    Inspector.Show(scene,{})

    scene.registerBeforeRender(function () {

    });

    engine.runRenderLoop(() => {
        scene.render();
    });
}
