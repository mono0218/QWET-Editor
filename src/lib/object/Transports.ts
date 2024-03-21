import { AbstractMesh } from '@babylonjs/core'

export interface ITransport {
    px: number
    py: number
    pz: number
    rx: number
    ry: number
    rz: number
    sx: number
    sy: number
    sz: number
}

export default function changeTransport(
    watch: ITransport,
    mesh: AbstractMesh
): void {
    console.log(watch)
    mesh.position.x = watch.px
    mesh.position.y = watch.py
    mesh.position.z = watch.pz
    mesh.rotation.x = watch.rx
    mesh.rotation.y = watch.ry
    mesh.rotation.z = watch.rz
    mesh.scaling.x = watch.sx
    mesh.scaling.y = watch.sy
    mesh.scaling.z = watch.sz
}
