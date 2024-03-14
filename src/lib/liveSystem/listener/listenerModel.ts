import {Scene, SceneLoader, Vector3} from "@babylonjs/core";

export class listenerModel {
    scene: Scene;

    constructor(scene:Scene){
        this.scene = scene;
    }

    async  createAvatar(uuid:string){
        SceneLoader.ImportMeshAsync("", "",new URL("/public/ghost.glb", import.meta.url).href, this.scene,
            null,null,uuid).then(r=>{
            r.meshes[0].name = uuid
            r.meshes[0].scaling = new Vector3(0.8,0.8,0.8)
            r.meshes[0].position = new Vector3(1000,1000,1000)
        })
        return
    }

    async  moveAvatar(uuid:string,position:string){
        const mesh = this.scene.getMeshByName(uuid);
        if(mesh){
            mesh.position = new Vector3(Number(position.split(",")[0]),Number(position.split(",")[1]),Number(position.split(",")[2]));
        }
    }

    async removeAvatar(uuid:string){
        this.scene.getMeshByName(uuid)?.dispose()
    }
}
