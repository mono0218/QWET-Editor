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
import {FlyCamera, FreeCamera, Scene, Vector3, Vector4, WebXRSessionManager} from "@babylonjs/core";
import {GLTFFileLoader} from "@babylonjs/loaders";
import '@babylonjs/inspector'
import {ImportWithAnimation} from "@/lib/vrm";
import Songle from "../../../../node_modules/songle-api/lib/api";
import io from 'socket.io-client';

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

let scene:Scene

export default function MMD(data:liveProps){
    const [scene,setScene] = useState<Scene>()
    liveData = data
    useEffect(() => {
        const canvas:HTMLCanvasElement = document.getElementById("canvas")
        const edit = document.getElementById("edit")
        const engine = new Engine(canvas)

        vrm(engine,canvas).then(data => {
            SongleAPI(data).then(r => {
                    const socket = new WebSocket('ws://localhost:5001');

                    const wsavatar = new wsAvatar()

                    socket.addEventListener('open', (event) => {
                        console.log('WebSocket connection opened', event);
                    });

                    socket.addEventListener('message', (event) => {
                        const message = event.data;
                        const json = JSON.parse(message)
                        wsavatar.create(message.uuid)

                        console.log('Received message:', json);
                    });

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
    scene = new Scene(engine);

    const camera = new FreeCamera("camera1", new Vector3(0, 2, -2), scene);

    scene.onPointerDown = (evt) =>{
        if(evt.button === 0) engine.enterPointerlock()
        if(evt.button === 1) engine.enterPointerlock()
    }

    const framesPerSecond = 60;
    const gravity = -9.81
    scene.gravity= new Vector3(0, gravity/framesPerSecond, 0)
    scene.collisionsEnabled = true

    camera.attachControl()
    camera.applyGravity= true
    camera.checkCollisions = true
    camera.ellipsoid = new Vector3(1,1,1,)

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

class wsAvatar{
    uuid:string
    scene:Scene

    constructor(){
        this.uuid = ""
        this.scene = scene
    }

    async catch(message:any){
        if(message.status === "join"){

        }else if(message.status === "move"){

        }else if(message.status === "end"){

        }
    }

    async create(uuid:string){
        const userVrm = await fetch("/vrm-1.vrm");
        const userFile = new File([await userVrm.arrayBuffer()],"vrm-1.vrm")

        SceneLoader.ImportMesh("", "", userFile, scene, null, null, null,null,uuid)
    }

    async move(uuid:string){
        scene.getMeshByName(uuid).position = new Vector3(1,1,1)
    }

    async end(uuid:string){
        scene.getMeshByName(uuid)
    }
}
