import { TransformNode, Vector3 } from '@babylonjs/core'

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
    nodes: TransformNode
): void {
    nodes.position = new Vector3(watch.px, watch.py, watch.pz)
    nodes.rotation = new Vector3(watch.rx, watch.ry, watch.rz)
    nodes.scaling = new Vector3(watch.sx, watch.sy, watch.sz)
}
