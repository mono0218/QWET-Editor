import 'babylon-mmd/esm/Loader/Optimized/bpmxLoader'
import { MeshComponent } from '@/components/objects/mesh/meshComponent'
import { MmdAnimation, MmdModel, VmdLoader } from 'babylon-mmd'
import { Mesh, SceneLoader } from '@babylonjs/core'
import { BasicInspector } from '@/components/uiComponents/basicInspector'

export class AvatarComponent extends MeshComponent {
    mmdModel: MmdModel | null = null
    motion:MmdAnimation | null = null
    animationFile: File | null = null

    constructor(avatarFile: File) {
        super(null, avatarFile)
    }

    init(){
        if (!this.object) throw new Error('Object is not initialized')
        if (!this.file) return
        SceneLoader.ImportMesh (
            "",
            "",
            this.file,
            this.object.scene,
            (meshes)=>{
                this.mesh = meshes[0] as Mesh
                this.initSet()
                this.defaultShader()

                if (!this.object) throw new Error('Object is not initialized')
                this.object.uniqueId = this.mesh.uniqueId
                this.mmdModel = this.object.editor.mmdRuntime.createMmdModel(this.mesh!)
            }
        )

        this.uiComponentList.push(new BasicInspector(this))
    }

    async addMmdAnimation(animationName: string, animationFile: File) {
        if (!this.object) throw new Error('Object is not initialized')
        if (!this.mmdModel) throw new Error('mmdModel is required')
        const vmdLoader = new VmdLoader(this.object.scene)
        this.motion = await vmdLoader.loadAsync(animationName, animationFile)
        this.mmdModel.addAnimation(this.motion)
        this.animationFile = animationFile
    }

    setMmdAnimation(animationName: string) {
        if (!this.object) throw new Error('Object is not initialized')
        if (!this.mmdModel) throw new Error('mmdModel is required')
        this.mmdModel.setAnimation(animationName)
    }

    playMmdAnimation() {
        if (!this.object) throw new Error('Object is not initialized')
        if (!this.mmdModel) throw new Error('mmdModel is required')
        this.object.editor.mmdRuntime.playAnimation().then()
    }

    stopMmdAnimation() {
        if (!this.object) throw new Error('Object is not initialized')
        if (!this.mmdModel) throw new Error('mmdModel is required')
        this.object.editor.mmdRuntime.pauseAnimation()
    }
}
