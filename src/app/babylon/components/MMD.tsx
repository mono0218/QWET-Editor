"use client"
import React, {useState} from 'react'
import { useEffect } from 'react'
import { Engine } from "@babylonjs/core/Engines/engine";
import "babylon-mmd/esm/Loader/pmxLoader";
import '@babylonjs/loaders'
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF/2.0"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
import {FlyCamera, Scene, Vector3, WebXRSessionManager} from "@babylonjs/core";
import {GLTFFileLoader} from "@babylonjs/loaders";
import '@babylonjs/inspector'
import {ImportWithAnimation} from "@/lib/vrm";
import Songle from "../../../../node_modules/songle-api/lib/api";

export type liveProps ={
    uuid:string
    modelUrl:string;
    motionUrl:string;
    stageUrl:string;
    movieUrl:string;

    accessToken:string;
    secretToken?:string;
}

let liveData:liveProps

export default function MMD(data:liveProps){
    const [scene,setScene] = useState<Scene>()
    liveData = data
    useEffect(() => {
        const canvas:HTMLCanvasElement = document.getElementById("canvas")
        const edit = document.getElementById("edit")
        const engine = new Engine(canvas)

        vrm(engine,canvas).then(data => {
            SongleAPI(data).then(r => {
                    engine.runRenderLoop(() => {
                        data.render();
                    });
                }
            )
        })
    },[])

    return (
        <>
            <div className="media"></div>

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

    const camera = new FlyCamera("camera1", new Vector3(0, 2, -2), scene);
    camera.attachControl(true,);
    camera.speed=1

    SceneLoader.RegisterPlugin(new VRMFileLoader());
    const vrm = await fetch(liveData.modelUrl);
    const animation = await fetch(liveData.motionUrl);

    const vrmFile = new File([await vrm.arrayBuffer()],"model.vrm")
    const animationFile = new File([await animation.arrayBuffer()],"animation.glb")

    await ImportWithAnimation("01",vrmFile,animationFile,scene)

    const stage = await fetch(liveData.stageUrl);
    await SceneLoader.ImportMeshAsync("","",new File([await stage.arrayBuffer()],"stage.glb"),scene)

    await scene.createDefaultXRExperienceAsync();
    const sessionManager = new WebXRSessionManager(scene);
    return scene
}

async function SongleAPI(scene:Scene){

    let player = new Songle.Player({
        mediaElement: document.querySelector('div.media'),
        accessToken: liveData.accessToken,
        secretToken: liveData.secretToken
    });

    player.addPlugin(new Songle.Plugin.SongleSync());
    player.useMedia(liveData.movieUrl);

    player.on("mediaReady",
        function(ev) {
            player.play();
        }
    );

    player.on("mediaPlay",
        function(ev){
            let frame = player.positionTime / 1000 * 60 + 35

            scene.getAnimationGroupByName("Take1").goToFrame(frame)
            scene.getAnimationGroupByName("Take1").start(false)
        }
    )
}
