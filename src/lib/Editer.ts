import {
    DefaultRenderingPipeline,
    Engine,
    FlyCamera,
    GizmoManager, LightGizmo,
    PositionGizmo,
    Scene,
    TransformNode,
    UtilityLayerRenderer,
    Vector3
} from "@babylonjs/core";
import {MmdManager} from "./manager/mmdManager";
import {LightManager} from "@/lib/manager/lightManager";

export class QwetEditer{
    engine:Engine
    scene:Scene
    mmdManager:MmdManager
    lightManager:LightManager
    gizmo:GizmoManager
    lightGizmo:LightGizmo
    postProcession:DefaultRenderingPipeline

    constructor() {
        const {engine,scene} = this.initEngine()
        this.engine = engine
        this.scene = scene
        this.createSpawnPoint()

        this.gizmo = new GizmoManager(this.scene);
        this.lightGizmo = new LightGizmo(this.gizmo.utilityLayer)
        this.lightManager = new LightManager(this.scene)
        this.postProcession = new DefaultRenderingPipeline(
            "defaultPipeline", // The name of the pipeline
            true, // Do you want the pipeline to use HDR texture?
            scene, // The scene instance
            this.scene.cameras // The list of cameras to be attached to
        )

        this.mmdManager = new MmdManager(scene)
    }

    initEngine(){
        const canvas = document.querySelector('canvas')
        const engine: Engine = new Engine(canvas, true)
        const scene: Scene = new Scene(engine)

        const camera = new FlyCamera('camera', new Vector3(0, 0, 0), scene)
        camera.attachControl(true)

        engine.runRenderLoop(() => {
            scene.render()
        })
        return {engine,scene}
    }

    createSpawnPoint(){
        const ListenerStartPosition = new TransformNode(
            'ListenerStartPosition',
            this.scene
        )
        const LiverStartPosition = new TransformNode(
            'LiverStartPosition',
            this.scene
        )

        ListenerStartPosition.position = new Vector3(0, 0, 0)
        LiverStartPosition.position = new Vector3(0, 0, 0)
    }
}
