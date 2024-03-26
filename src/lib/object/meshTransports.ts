import { AbstractMesh, Vector3 } from '@babylonjs/core'

export interface IMeshTransport {
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

export default function changeMeshTransport(
    watch: IMeshTransport,
    mesh: AbstractMesh
): void {
    mesh.position = new Vector3(watch.px, watch.py, watch.pz)
    mesh.rotation = new Vector3(watch.rx, watch.ry, watch.rz)
    mesh.scaling = new Vector3(watch.sx, watch.sy, watch.sz)
}
