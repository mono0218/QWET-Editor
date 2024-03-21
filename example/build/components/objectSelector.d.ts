import { Scene } from '@babylonjs/core'
export default function ObjectSelector({
    scene,
    onObjectSelect,
}: {
    scene: Scene
    onObjectSelect: (meshId: string) => void
}): import('react/jsx-runtime').JSX.Element
