import {DirectionalLight, HemisphericLight, PointLight, Scene, SpotLight, Vector3} from "@babylonjs/core";

export class LightManager{
    allLight:Array<SpotLight | PointLight | DirectionalLight | HemisphericLight> = []
    scene: Scene

    constructor(scene:Scene) {
        this.scene = scene
    }

    addPointLight(name:string) {
        const light = new PointLight(name, new Vector3(0, 0, 0), this.scene)
        this.allLight.push(light)
    }

    addDirectionalLight(name:string) {
        const light = new DirectionalLight(name, new Vector3(0, -1, 0), this.scene)
        this.allLight.push(light)
    }

    addSpotLight(name:string) {
        const light = new SpotLight(name, new Vector3(0, 0, 0), new Vector3(0, 0, 0), Math.PI / 3, 2, this.scene)
        this.allLight.push(light)
    }

    addHemisphericLight(name:string) {
        const light = new HemisphericLight(name, new Vector3(0, 1, 0), this.scene)
        this.allLight.push(light)
    }
}
