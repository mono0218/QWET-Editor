import {
    Color3,
    Color4,
    DefaultRenderingPipeline,
    Engine,
    FlyCamera,
    GizmoManager,
    LightGizmo,
    MeshBuilder,
    Scene,
    SSRRenderingPipeline,
    StandardMaterial,
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
    timeline?: TimeLineCanvas

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
            this.mmdRuntime.playAnimation().then()
        }, 100)
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

        const env = scene.createDefaultEnvironment()
        env?.skybox?.dispose()
        env?.ground?.dispose()
        scene.environmentIntensity = 0

        const defaultPipeline = new DefaultRenderingPipeline(
            'default',
            true,
            scene,
            [scene.activeCamera!]
        )
        defaultPipeline.samples = 10
        defaultPipeline.chromaticAberrationEnabled = true
        defaultPipeline.chromaticAberration.aberrationAmount = 1
        defaultPipeline.fxaaEnabled = true
        defaultPipeline.fxaa.samples = 40
        defaultPipeline.grainEnabled = true
        defaultPipeline.imageProcessingEnabled = true
        defaultPipeline.imageProcessing.colorCurvesEnabled = false
        defaultPipeline.bloomEnabled = false
        defaultPipeline.bloomKernel = 320
        defaultPipeline.bloomWeight = 0.8
        defaultPipeline.bloomThreshold = 0.2
        defaultPipeline.bloomScale = 0.2
        defaultPipeline.depthOfFieldEnabled = true
        defaultPipeline.imageProcessing.vignetteWeight = 0.5
        defaultPipeline.imageProcessing.vignetteStretch = 0.5
        defaultPipeline.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0)
        defaultPipeline.imageProcessing.toneMappingEnabled = false
        defaultPipeline.imageProcessing.vignetteEnabled = true
        defaultPipeline.depthOfField.focalLength = 0

        const mesh = MeshBuilder.CreateSphere(
            'sphere',
            { diameter: 10000 },
            scene
        )
        const material = new StandardMaterial('material', scene)

        material.ambientColor = new Color3(1, 1, 1)
        material.disableLighting = true
        material.backFaceCulling = false
        mesh.material = material

        const ssr = new SSRRenderingPipeline(
            'ssr', // The name of the pipeline
            scene, // The scene to which the pipeline belongs
            [scene.activeCamera!], // The list of cameras to attach the pipeline to
            false // Whether or not to use the geometry buffer renderer (default: false, use the pre-pass renderer)
        )

        ssr.samples = 100

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
