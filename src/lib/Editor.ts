import {
    DefaultRenderingPipeline,
    Engine,
    FlyCamera,
    GizmoManager,
    LightGizmo,
    Scene,
    TransformNode,
    Vector3,
} from '@babylonjs/core'
import { MmdManager } from './manager/mmdManager'
import { LightManager } from '@/lib/manager/lightManager'
import { MeshManager } from '@/lib/manager/meshManager'
import {CameraManager} from "@/lib/manager/cameraManager";
import {RttManager} from "@/lib/manager/rttManager";

export class QwetEditor {
    engine: Engine
    scene: Scene
    mmdManager: MmdManager
    lightManager: LightManager
    gizmo: GizmoManager
    lightGizmo: LightGizmo
    cameraManager: CameraManager
    postProcession: DefaultRenderingPipeline
    meshManager: MeshManager
    rttManager:RttManager

    constructor() {
        const { engine, scene } = this.initEngine()
        this.engine = engine
        this.scene = scene
        this.createSpawnPoint()

        this.gizmo = new GizmoManager(this.scene)
        this.lightGizmo = new LightGizmo(this.gizmo.utilityLayer)
        this.lightManager = new LightManager(this.scene)
        this.postProcession = new DefaultRenderingPipeline(
            'defaultPipeline', // The name of the pipeline
            false, // Do you want the pipeline to use HDR texture?
            scene, // The scene instance
            this.scene.cameras // The list of cameras to be attached to
        )
        this.mmdManager = new MmdManager(scene)
        this.meshManager = new MeshManager(scene)
        this.cameraManager = new CameraManager(scene)
        this.rttManager = new RttManager(this);
    }

    initEngine() {
        const canvas = document.querySelector('canvas')
        const engine: Engine = new Engine(canvas, true)
        const scene: Scene = new Scene(engine)

        const camera = new FlyCamera('camera', new Vector3(0, 0, 0), scene)
        camera.attachControl(true)

        engine.runRenderLoop(() => {
            scene.render()
        })
        return { engine, scene }
    }

    createSpawnPoint() {
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
