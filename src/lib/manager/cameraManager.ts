import {Camera, Scene, Vector3} from "@babylonjs/core";

export class CameraManager{
    scene: Scene
    allCameras: Camera[] = []
    constructor(scene: Scene) {
        this.scene = scene
    }

    getCameraByUniqueID(uniqueId: number) {
        return this.allCameras.filter((camera) => camera.uniqueId === uniqueId)[0]
    }

    createCamera(name:string){
        const camera = new Camera(name, new Vector3(0, 0, 0), this.scene)
        this.addCamera(camera)
        return camera
    }

    addCamera(camera:Camera){
        this.allCameras.push(camera);
    }
}
