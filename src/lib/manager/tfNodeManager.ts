import { TransformNode } from '@babylonjs/core'

export class tfNodeManager {
    List: TransformNode[] = []

    addNode(mesh: TransformNode) {
        this.List.push(mesh)
    }

    getNodeList() {
        return this.List
    }

    getNode(uniqueId: number) {
        return this.List.find((node) => node.uniqueId === uniqueId)
    }
}
