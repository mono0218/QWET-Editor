import {
    Engine,
    FlyCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'

export default function LiveEngine():[engine:Engine,scene:Scene] {
    const canvas = document.querySelector('canvas')
    const engine:Engine = new Engine(canvas, true)
    const scene:Scene = new Scene(engine)

    const camera = new FlyCamera('camera', new Vector3(0, 0, 0), scene)
    camera.attachControl(true)

    new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    MeshBuilder.CreateBox('box', {}, scene)

    engine.runRenderLoop(() => {
        scene.render()
    })

    return [engine,scene]
}
