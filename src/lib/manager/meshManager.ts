import {Mesh, Scene, SceneLoader, ShaderMaterial} from "@babylonjs/core";
import "@babylonjs/loaders/OBJ/objFileLoader";

export class MeshManager {
    scene: Scene;
    allMeshs: qwetObject[];
    constructor(scene:Scene) {
        this.scene = scene;
        this.allMeshs = [];
    }

    getMeshByUniqueID(uniqueId:number){
        const mesh = this.allMeshs.filter(object => object.mesh.uniqueId ===uniqueId)[0]
        if (mesh){
            return mesh
        }else{
            return null
        }
    }

    addMeshFile(file: File) {
        if (file.name.endsWith('.obj') || file.name.endsWith('.fbx')) {
            SceneLoader.ImportMeshAsync("", file.name, file, this.scene).then(r => {
                this.addMesh(r.meshes[0] as Mesh);
            });
        }
    }

    addMesh(mesh:Mesh) {
        this.allMeshs.push(new qwetObject(mesh));
    }

    removeMesh(mesh:Mesh) {
        const index = this.allMeshs.indexOf(this.getMeshByUniqueID(mesh.uniqueId)!);
        if (index > -1) {
          this.allMeshs.splice(index, 1);
        }
    }
}

class qwetObject{
    mesh:Mesh
    vertexShader:string
    fragmentShader:string
    constructor(mesh:Mesh){
        this.mesh = mesh
        const shaders = this.defaultShader()
        this.vertexShader = shaders.vertexShader
        this.fragmentShader = shaders.fragmentShader
    }

    defaultShader(){
        const vertexShader= `
            precision highp float;
            
            // Attributes
            attribute vec3 position;
            attribute vec2 uv;
            
            // Uniforms
            uniform mat4 worldViewProjection;
            
            // Varying
            varying vec2 vUV;
            
            void main(void) {
                gl_Position = worldViewProjection * vec4(position, 1.0);
                
                vUV = uv;
            }
        `

        const fragmentShader = `
            precision highp float;
            
            varying vec2 vUV;
            
            uniform sampler2D textureSampler;
            
            void main(void) {
                gl_FragColor = texture2D(textureSampler, vUV);
            }
        `

        return {vertexShader, fragmentShader}
    }

    getShader(){
        return {
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        }
    }

    editShader(vertexShader:string, fragmentShader:string){
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
        this.mesh.material = new ShaderMaterial("shader", this.mesh._scene, {
            vertex: this.vertexShader,
            fragment: this.fragmentShader
        });
    }
}

