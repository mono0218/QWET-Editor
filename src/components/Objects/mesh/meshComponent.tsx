import { QwetObject } from '@/types/object'
import { Mesh, SceneLoader, ShaderMaterial } from '@babylonjs/core'
import { QwetComponent } from '@/types/component'

export class MeshComponent implements QwetComponent {
    object: QwetObject
    mesh: Mesh
    file: File
    vertexShader: string = ''
    fragmentShader: string = ''

    constructor(mesh: Mesh | null = null, file: File | null = null) {
        if (!mesh && !file) throw new Error('mesh or file is required')

        if (mesh) {
            this.mesh = mesh
            this.initSet()
        } else if (file) {
            this.file = file
        }
    }

    init(): void {
        SceneLoader.ImportMeshAsync(
            '',
            this.file.name,
            this.file,
            this.object.scene
        ).then((result) => {
            this.mesh = result.meshes[0] as Mesh
            this.initSet()
        })
        this.defaultShader()
    }

    private initSet() {
        this.object.setPos(
            this.mesh.position.x,
            this.mesh.position.y,
            this.mesh.position.z
        )
        this.object.setRot(
            this.mesh.rotation.x,
            this.mesh.rotation.y,
            this.mesh.rotation.z
        )
        this.object.setScale(
            this.mesh.scaling.x,
            this.mesh.scaling.y,
            this.mesh.scaling.z
        )
    }

    update(): void {
        const pos = this.object.position
        const rot = this.object.rotation
        const scale = this.object.scale

        this.mesh.position.set(pos.x, pos.y, pos.z)
        this.mesh.rotation.set(rot.x, rot.y, rot.z)
        this.mesh.scaling.set(scale.x, scale.y, scale.z)
    }

    destroy(): void {
        this.mesh.dispose()
    }

    defaultShader() {
        const vertexShader = `
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

        return { vertexShader, fragmentShader }
    }

    editVertexShader(vertexShader: string) {
        this.vertexShader = vertexShader
        this.mesh.material = new ShaderMaterial('shader', this.mesh._scene, {
            vertex: this.vertexShader,
            fragment: this.fragmentShader,
        })
    }

    editFragmentShader(fragmentShader: string) {
        this.fragmentShader = fragmentShader
        this.mesh.material = new ShaderMaterial('shader', this.mesh._scene, {
            vertex: this.vertexShader,
            fragment: this.fragmentShader,
        })
    }

    ui(): JSX.Element {
        return <></>
    }
}
