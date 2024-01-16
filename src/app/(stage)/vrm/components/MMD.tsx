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
import {SceneLoader, SceneLoaderAnimationGroupLoadingMode} from '@babylonjs/core/Loading/sceneLoader';

import {
    AnimationGroup,
    ArcRotateCamera, AssetContainer,
    DirectionalLight, FlyCamera, FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Vector3
} from "@babylonjs/core";
import {GLTFFileLoader} from "@babylonjs/loaders";
import '@babylonjs/inspector';
import {Inspector} from "@babylonjs/inspector";
let TPlayer:Player

let modelBoneList
let oldBoneList
let newBoneList

export default function MMD(){

    useEffect(() => {
        const canvas:HTMLElement = document.getElementById("canvas")
        const edit = document.getElementById("edit")
        const engine = new Engine(canvas)

        vrm(engine,canvas).then()
    })

    return (
        <>
            <canvas id="canvas" className="w-2/3 h-screen inline-flex"> </canvas>
            <div id="edit" className="w-1/3 h-screen inline-flex bg-gray-300">
                <p className="text-center　text-sm flex flex-col">Motion Allocation</p>
                <Editbar/>
            </div>
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

async function vrm(engine:Engine,canvas:HTMLElement){
    const scene = new Scene(engine);

    const camera = new FlyCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.speed=0.1
    camera.attachControl(true,canvas);

    SceneLoader.RegisterPlugin(new VRMFileLoader());
    SceneLoader.Append("http://localhost:3000/","a.vrm",scene)

    await SceneLoader.AppendAsync("http://localhost:3000/","aipai.glb")

    const a:AnimationGroup[] = scene.animationGroups
    console.log(a)
    a[0].animatables.map((anime)=>{console.log(anime.target.name)})

    console.log(scene.transformNodes)
    scene.transformNodes.map((transform) => { console.log(transform.name)})

    scene.registerBeforeRender(function () {

    });

    engine.runRenderLoop(() => {
        scene.render();
    });
}

function Editbar(){
    return(
        <>
            <div className="w-full flex p-2">
                <input className="w-full flex" type="text"/>
                <input className="w-full flex" type="text"/>
            </div>
        </>
    )
}
