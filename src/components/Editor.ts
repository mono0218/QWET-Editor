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
import { MmdRuntime } from 'babylon-mmd'
import TimeLineCanvas from '@/TimeLineCanvas'

export class QwetEditor {
    engine: Engine
    scene: Scene
    gizmo: GizmoManager
    lightGizmo: LightGizmo
    postProcession: DefaultRenderingPipeline
    objectList: Array<QwetObject> = []
    mmdRuntime: MmdRuntime
    timeline?:TimeLineCanvas

    constructor() {
        const { engine, scene } = this.initEngine()
        this.engine = engine
        this.scene = scene
        this.createSpawnPoint()

        this.gizmo = new GizmoManager(this.scene)
        this.lightGizmo = new LightGizmo(this.gizmo.utilityLayer)
        this.postProcession = new DefaultRenderingPipeline(
            'defaultPipeline',
            false,
            scene,
            this.scene.cameras
        )
        this.mmdRuntime = new MmdRuntime(this.scene)
        this.mmdRuntime.register(scene)

        setInterval(() => {
            this.mmdRuntime.playAnimation()
        },100)
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
