import 'babylon-mmd/esm/Loader/Optimized/bpmxLoader'
import { MeshComponent } from '@/components/objects/mesh/meshComponent'
import { MmdModel, VmdLoader } from 'babylon-mmd'

export class AvatarComponent extends MeshComponent {
    mmdModel: MmdModel
    animationFile: File | null = null
    constructor(avatarFile: File) {
        super(null, avatarFile)
        if (!this.mesh) throw new Error('file is required')
        this.mmdModel = this.object.editor.mmdRuntime.createMmdModel(this.mesh)
    }

    async addMmdAnimation(animationName: string, animationFile: File) {
        if (!this.mmdModel) throw new Error('mmdModel is required')
        const vmdLoader = new VmdLoader(this.object.scene)
        const motion = await vmdLoader.loadAsync(animationName, animationFile)
        this.mmdModel.addAnimation(motion)
        this.animationFile = animationFile
    }

    setMmdAnimation(animationName: string) {
        if (!this.mmdModel) throw new Error('mmdModel is required')
        this.mmdModel.setAnimation(animationName)
    }

    playMmdAnimation() {
        if (!this.mmdModel) throw new Error('mmdModel is required')
        this.object.editor.mmdRuntime.playAnimation().then()
    }

    stopMmdAnimation() {
        if (!this.mmdModel) throw new Error('mmdModel is required')
        this.object.editor.mmdRuntime.pauseAnimation()
    }
}
