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
import { QwetObject } from '@/types/object'

export class QwetEditor {
    engine: Engine
    scene: Scene
    gizmo: GizmoManager
    lightGizmo: LightGizmo
    postProcession: DefaultRenderingPipeline
    objectList: Array<QwetObject> = []

    constructor() {
        const { engine, scene } = this.initEngine()
        this.engine = engine
        this.scene = scene
        this.createSpawnPoint()

        this.gizmo = new GizmoManager(this.scene)
        this.lightGizmo = new LightGizmo(this.gizmo.utilityLayer)
        this.postProcession = new DefaultRenderingPipeline(
            'defaultPipeline', // The name of the pipeline
            false, // Do you want the pipeline to use HDR texture?
            scene, // The scene instance
            this.scene.cameras // The list of cameras to be attached to
        )
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
