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
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import { Inspector } from '@babylonjs/inspector';


let mmdRuntime:MmdRuntime
let TPlayer:Player

export default function Home(): JSX.Element  {
    const canvas = document.createElement("canvas");
    useEffect(() => {
        TPlayer = new Player({app: {token: "W93sKiETsRLte1ML"},mediaElement: document.querySelector("#media"),});
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        document.body.appendChild(canvas);

        const engine = new Engine(canvas)
        BaseRuntime.Create({
            canvas,
            engine,
            sceneBuilder: new SceneBuilder()
        }).then(runtime => runtime.run());
    }, [])
    return (
        <>
            <button onClick={() => {
                mmdRuntime.pauseAnimation()
            }}>aaaa
            </button>
            <button onClick={() => {
                mmdRuntime.playAnimation()
            }}>bbbb
            </button>
            <button onClick={() => {
                mmdRuntime.seekAnimation(300,false)
            }}>cccc
            </button>

            <style>
                button {
                "z-index: 10000"
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

        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.4;
        hemisphericLight.specular.set(0, 0, 0);
        hemisphericLight.groundColor.set(1, 1, 1);

        const directionalLight = new DirectionalLight("DirectionalLight", new Vector3(0.5, -1, 1), scene);
        directionalLight.intensity = 0.8;
        directionalLight.autoCalcShadowZBounds = false
        directionalLight.autoUpdateExtends = false
        directionalLight.shadowMaxZ = 20
        directionalLight.shadowMinZ = -20
        directionalLight.orthoTop = 18
        directionalLight.orthoBottom = -3
        directionalLight.orthoLeft = -10
        directionalLight.orthoRight= -10
        directionalLight.shadowOrthoScale = 0

        const shadowGenerator = new ShadowGenerator(2048, directionalLight, true,);
        shadowGenerator.usePercentageCloserFiltering = true
        shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_LOW
        shadowGenerator.forceBackFacesOnly = false
        shadowGenerator.frustumEdgeFalloff = 0.1
        shadowGenerator.bias = 0.01;

        //MMDモデルロード
        const mmdMesh = await SceneLoader.ImportMeshAsync("", "/res/yoisaku/", "knd.pmx", scene)
            .then((result) => result.meshes[0] as MmdMesh);
        const stageMesh = await SceneLoader.ImportMeshAsync("","/res/sekaistage/","stage.pmx",scene)
            .then((result) => result.meshes[0] as MmdMesh);
        const backMesh = await SceneLoader.ImportMeshAsync("","/res/sekaistage/","天空球.pmx",scene)
            .then((result) => result.meshes[0] as MmdMesh);
        shadowGenerator.addShadowCaster(mmdMesh);
        shadowGenerator.addShadowCaster(stageMesh)
        shadowGenerator.addShadowCaster(backMesh)


        let gl = new GlowLayer("glow", scene,);
        gl.intensity = 1.0;
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

        return scene;
    }
}
