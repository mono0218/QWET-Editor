"use client"
import React from 'react'
import { useEffect } from 'react'
import { Engine } from "@babylonjs/core/Engines/engine";
import { Player } from "textalive-app-api";
import {
    Color4,
    DefaultRenderingPipeline,
    DirectionalLight,
    FlyCamera, GlowLayer,
    HavokPlugin,
    HemisphericLight, ImageProcessingConfiguration,
    SceneLoader,
    ShadowGenerator
} from "@babylonjs/core";
import { Scene, Vector3 } from "@babylonjs/core";
import {MmdMesh, MmdPhysics, MmdRuntime, VmdLoader} from "babylon-mmd";
import "babylon-mmd/esm/Loader/pmxLoader";
import HavokPhysics from "@babylonjs/havok";
import "@babylonjs/inspector"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

let mmdRuntime:MmdRuntime
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

        TPlayer = new Player({app: {token: "W93sKiETsRLte1ML"}, mediaElement: media});
        TPlayer.addListener({
            onAppReady() {
                console.log("APPReady")
                TPlayer.createFromSongUrl("https://www.youtube.com/watch?v=joTyBhemAGo")
            },
            onPlay() {
                mmdRuntime.playAnimation().then(() => console.log("再生しました"))
            },
            onPause() {
                mmdRuntime.pauseAnimation()
            }
        })

        const engine = new Engine(canvas)

        BaseRuntime.Create({
            canvas:canvas,
            engine:engine,
            sceneBuilder: new SceneBuilder()
        }).then(runtime => runtime.run());
    }, [])
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
                mmdRuntime.seekAnimation(300,false).then(() => console.log("時間を同期しました"))
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


export interface ISceneBuilder {
    build(canvas: HTMLCanvasElement, engine: Engine): Scene | Promise<Scene>;
}

export interface BaseRuntimeInitParams {
    canvas: HTMLCanvasElement;
    engine: Engine;
    sceneBuilder: ISceneBuilder;
}

export class BaseRuntime {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _engine: Engine;
    private _scene: Scene;
    private _onTick: () => void;

    private constructor(params: BaseRuntimeInitParams) {
        this._canvas = params.canvas;
        this._engine = params.engine;

        this._scene = null!;
        this._onTick = null!;
    }

    public static async Create(params: BaseRuntimeInitParams): Promise<BaseRuntime> {
        const runtime = new BaseRuntime(params);
        runtime._scene = await runtime._initialize(params.sceneBuilder);
        runtime._onTick = runtime._makeOnTick();
        return runtime;
    }

    public run(): void {
        const engine = this._engine;

        window.addEventListener("resize", this._onResize);
        engine.runRenderLoop(this._onTick);
    }

    public dispose(): void {
        window.removeEventListener("resize", this._onResize);
        this._engine.dispose();
    }

    private readonly _onResize = (): void => {
        this._engine.resize();
    };

    private async _initialize(sceneBuilder: ISceneBuilder): Promise<Scene> {
        return await sceneBuilder.build(this._canvas, this._engine);
    }

    private _makeOnTick(): () => void {
        const scene = this._scene;
        console.log(this._engine.getFps().toFixed() + " fps")
        return () => scene.render();
    }
}

export class SceneBuilder implements ISceneBuilder {
    public async build(_canvas: HTMLCanvasElement, engine: Engine): Promise<Scene> {
        const scene = new Scene(engine);
        const camera = new FlyCamera('FlyCamera', new Vector3(0, 2, -5), scene)
        camera.speed = 3
        camera.attachControl( true)

        const directionalLight = new DirectionalLight("DirectionalLight", new Vector3(0, 75, -130), scene);
        directionalLight.direction = new Vector3(100,-75,-260)
        directionalLight.intensity = 10000;
        directionalLight.autoCalcShadowZBounds = false
        directionalLight.autoUpdateExtends = false
        directionalLight.shadowMaxZ = 1000
        directionalLight.shadowMinZ = -1000
        directionalLight.orthoTop = 1000
        directionalLight.orthoBottom = -1000
        directionalLight.orthoLeft = -1000
        directionalLight.orthoRight= -1000
        directionalLight.shadowOrthoScale = 1000

        const shadowGenerator = new ShadowGenerator(2048, directionalLight, true,);
        shadowGenerator.usePercentageCloserFiltering = true
        shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH
        shadowGenerator.forceBackFacesOnly = false
        shadowGenerator.frustumEdgeFalloff = 0.1
        shadowGenerator.bias = 0.01;

        //MMDモデルロード
        const mmdMesh = await SceneLoader.ImportMeshAsync("", "/res/yoisaku/", "knd.pmx", scene)
            .then((result) => result.meshes[0] as MmdMesh);
        const stageMesh = await SceneLoader.ImportMeshAsync("","/res/kotami/","stage.pmx",scene)
            .then((result) => result.meshes[0] as MmdMesh);
        //shadowGenerator.addShadowCaster(mmdMesh);
        shadowGenerator.addShadowCaster(stageMesh)


        let gl = new GlowLayer("glow", scene);
        gl.intensity = 0.1;
        gl.referenceMeshToUseItsOwnMaterial(stageMesh);

        const defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled= true
        defaultPipeline.bloomEnabled = true;
        defaultPipeline.bloomScale = 1.0
        defaultPipeline.bloomWeight = 1.0
        defaultPipeline.bloomThreshold -= 0.98
        defaultPipeline.imageProcessing.toneMappingEnabled = true;
        defaultPipeline.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
        defaultPipeline.imageProcessing.vignetteWeight = 0.5;
        defaultPipeline.imageProcessing.vignetteStretch = 0.5;
        defaultPipeline.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0);
        defaultPipeline.imageProcessing.vignetteEnabled = true;

        //物理エンジンロード
        const havokInstance = await HavokPhysics();
        const havokPlugin = new HavokPlugin(true, havokInstance)
        scene.enablePhysics(new Vector3(0, -9.8 * 10, 0), havokPlugin)

        //MMDモデル登録
        mmdRuntime = new MmdRuntime(new MmdPhysics(scene))
        const mmdModel = mmdRuntime.createMmdModel(mmdMesh)
        mmdRuntime.register(scene)

        //モーションロード
        const vmdloader = new VmdLoader(scene)
        const motion = await vmdloader.loadAsync("motion",[
            "/res/yoisaku/aa.vmd"
        ])
        mmdModel.addAnimation(motion)
        mmdModel.setAnimation("motion")
        console.log(engine.getFps().toFixed() + " fps")
        mmdRuntime.loggingEnabled = true

        await scene.debugLayer.show();

        return scene;
    }
}