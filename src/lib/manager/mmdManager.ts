import 'babylon-mmd/esm/Loader/pmxLoader'
import { Mesh, Scene, SceneLoader } from '@babylonjs/core'
import { MmdAnimation, MmdModel, MmdRuntime, VmdLoader } from 'babylon-mmd'

export class MmdManager {
    allList: MmdModel[] = []
    scene: Scene
    avatar: MmdModel | undefined
    stage: MmdModel | undefined
    motion: MmdAnimation | undefined
    mmdRuntime: MmdRuntime
    vmdLoader: VmdLoader

    constructor(scene: Scene) {
        this.scene = scene
        this.vmdLoader = new VmdLoader(this.scene)
        this.mmdRuntime = new MmdRuntime()
        this.mmdRuntime.register(this.scene)
    }

    async loadAvatar(file: File) {
        const mmdMesh = await SceneLoader.ImportMeshAsync(
            undefined,
            "",
            file,
            this.scene
        )
        this.avatar = this.mmdRuntime.createMmdModel(mmdMesh.meshes[0] as Mesh)
        this.allList.push(this.avatar)
    }

    async loadStage(file: File,) {
        const mmdMesh = await SceneLoader.ImportMeshAsync(
            undefined,
            '',
            file,
            this.scene
        ).then((result) => result.meshes[0])
        this.stage = this.mmdRuntime.createMmdModel(mmdMesh as Mesh)
        this.allList.push(this.stage)
    }

    async loadMotion(file: File) {
        this.motion = await this.vmdLoader.loadAsync('motion', file)
    }

    async playMotion() {
        if (!this.avatar || !this.motion) return
        this.avatar.addAnimation(this.motion)
        this.avatar.setAnimation('motion')
        await this.mmdRuntime.playAnimation()
    }
}
