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
import {after} from "node:test";
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
    scene.useRightHandedSystem = true;

    const camera = new FlyCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.speed=0.1
    camera.attachControl(true,canvas);

    SceneLoader.RegisterPlugin(new VRMFileLoader());
    const loaded = await  SceneLoader.ImportMeshAsync("","http://localhost:3000/","testtukuyomi.vrm",scene)
    await SceneLoader.ImportAnimationsAsync("http://localhost:3000/", "aipai.glb",scene,true,null,(oldTarget)=>{
        let target = oldTarget;

        for (let node of loaded.transformNodes) {
            const afterId = convertNameJson[node.id]
            if (afterId != undefined){
                if (target.id === afterId) {
                    console.log(afterId,node)
                    target = node;
                    break;
                }
            }
        }

        return target;
    })


    Inspector.Show(scene,{})

    console.log(scene)

    scene.registerBeforeRender(function () {

    });

    engine.runRenderLoop(() => {
        scene.render();
    });
}

const convertNameJson = {
    "J_Bip_C_Chest": "Spine1",
    "J_Bip_C_Head": "Head",
    "J_Bip_C_Hips": "Hips",
    "J_Bip_C_Neck": "Neck",
    "J_Bip_C_Spine": "Spine",
    "J_Bip_C_UpperChest": "Spine2",
    "J_Bip_L_Foot": "LeftFoot",
    "J_Bip_L_Hand": "LeftHand",
    "J_Bip_L_Index1": "LeftHandIndex1",
    "J_Bip_L_Index2": "LeftHandIndex2",
    "J_Bip_L_Index3": "LeftHandIndex3",
    "J_Bip_L_Little1": "LeftHandPinky1",
    "J_Bip_L_Little2": "LeftHandPinky2",
    "J_Bip_L_Little3": "LeftHandPinky3",
    "J_Bip_L_LowerArm": "LeftForeArm",
    "J_Bip_L_LowerLeg": "LeftLeg",
    "J_Bip_L_Middle1": "LeftHandMiddle1",
    "J_Bip_L_Middle2": "LeftHandMiddle2",
    "J_Bip_L_Middle3": "LeftHandMiddle3",
    "J_Bip_L_Ring1": "LeftHandRing1",
    "J_Bip_L_Ring2": "LeftHandRing2",
    "J_Bip_L_Ring3": "LeftHandRing3",
    "J_Bip_L_Shoulder": "LeftShoulder",
    "J_Bip_L_Thumb1": "LeftHandThumb1",
    "J_Bip_L_Thumb2": "LeftHandThumb2",
    "J_Bip_L_Thumb3": "LeftHandThumb3",
    "J_Bip_L_ToeBase": "LeftToeBase",
    "J_Bip_L_UpperArm": "LeftArm",
    "J_Bip_L_UpperLeg": "LeftUpLeg",
    "J_Bip_R_Foot": "RightFoot",
    "J_Bip_R_Hand": "RightHand",
    "J_Bip_R_Index1": "RightHandIndex1",
    "J_Bip_R_Index2": "RightHandIndex2",
    "J_Bip_R_Index3": "RightHandIndex3",
    "J_Bip_R_Little1": "RightHandPinky1",
    "J_Bip_R_Little2": "RightHandPinky2",
    "J_Bip_R_Little3": "RightHandPinky3",
    "J_Bip_R_LowerArm": "RightForeArm",
    "J_Bip_R_LowerLeg": "RightLeg",
    "J_Bip_R_Middle1": "RightHandMiddle1",
    "J_Bip_R_Middle2": "RightHandMiddle2",
    "J_Bip_R_Middle3": "RightHandMiddle3",
    "J_Bip_R_Ring1": "RightHandRing1",
    "J_Bip_R_Ring2": "RightHandRing2",
    "J_Bip_R_Ring3": "RightHandRing3",
    "J_Bip_R_Shoulder": "RightShoulder",
    "J_Bip_R_Thumb1": "RightHandThumb1",
    "J_Bip_R_Thumb2": "RightHandThumb2",
    "J_Bip_R_Thumb3": "RightHandThumb3",
    "J_Bip_R_ToeBase": "RightToeBase",
    "J_Bip_R_UpperArm": "RightArm",
    "J_Bip_R_UpperLeg": "RightUpLeg"
}