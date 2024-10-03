import { SceneSerializer } from '@babylonjs/core'
import React from 'react'
import { QwetEditor } from '@/components/Editor'
import { QwetObject } from '@/types/object'
import { AvatarComponent } from '@/components/Objects/mmd/avatarComponent'
import { PointLightComponent } from '@/components/Objects/light/pointLightComponent'
import { DirectionalLightComponent } from '@/components/Objects/light/directionalLightComponent'
import { MeshComponent } from '@/components/Objects/mesh/meshComponent'
import { StageComponent } from '@/components/Objects/mmd/stageComponent'

export default function Header({ editor }: { editor: QwetEditor }) {
    const onAvatarFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files || files?.length === 0) return

        for (const file of files) {
            if (file.name.endsWith('.bpmx')) {
                const object = new QwetObject(editor.scene)
                object.name = file.name
                object.addComponent(new AvatarComponent(null, file))
                editor.objectList.push(object)
            }
        }
    }

    const onStageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files || files?.length === 0) return

        for (const file of files) {
            if (file.name.endsWith('.bpmx')) {
                const object = new QwetObject(editor.scene)
                object.name = file.name
                object.addComponent(new StageComponent(null, file))
                editor.objectList.push(object)
            }
        }
    }

    const onMeshFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files || files?.length === 0) return

        const file = files[0]
        if (
            file.name.endsWith('.obj') ||
            file.name.endsWith('.gltf') ||
            file.name.endsWith('.glb')
        ) {
            const object = new QwetObject(editor.scene)
            object.name = file.name
            object.addComponent(new MeshComponent(null, file))
            editor.objectList.push(object)
        }
    }

    const onCreateLight = (text: string, select: string) => {
        switch (select) {
            case 'DirectionalLight': {
                const direction = new QwetObject(editor.scene)
                direction.name = text
                direction.addComponent(new DirectionalLightComponent())
                editor.objectList.push(direction)
                break
            }
            case 'HemisphericLight': {
                const hemispheric = new QwetObject(editor.scene)
                hemispheric.name = text
                const hemisphericLight = new DirectionalLightComponent()
                hemispheric.addComponent(hemisphericLight)
                break
            }
            case 'SpotLight': {
                const spot = new QwetObject(editor.scene)
                spot.name = text
                const spotLight = new DirectionalLightComponent()
                spot.addComponent(spotLight)
                break
            }
            case 'PointLight': {
                const point = new QwetObject(editor.scene)
                point.name = text
                const pointLight = new PointLightComponent()
                point.addComponent(pointLight)

                editor.objectList.push(point)
                break
            }
        }
    }

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">My Project</h1>
            <div className="flex mr-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn m-1">
                        Add OBJ
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-gray-800 rounded-box z-[1] w-52 p-2 shadow"
                    >
                        <li>
                            <a
                                className="btn"
                                onClick={() =>
                                    document
                                        .getElementById('my_modal_1')!
                                        .showModal()
                                }
                            >
                                Light
                            </a>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box">
                                    <input
                                        type="text"
                                        id="text"
                                        placeholder="Type here"
                                        className="input w-full max-w-xs"
                                    />

                                    <select
                                        id="select"
                                        className="select select-bordered w-full max-w-xs"
                                    >
                                        <option>
                                            {' '}
                                            ライトの種類を選択してください
                                        </option>
                                        <option>DirectionalLight</option>
                                        <option>HemisphericLight</option>
                                        <option>SpotLight</option>
                                        <option>PointLight</option>
                                    </select>

                                    <button
                                        className="btn"
                                        onClick={() => {
                                            const text =
                                                document.getElementById(
                                                    'text'
                                                ) as HTMLInputElement
                                            const select =
                                                document.getElementById(
                                                    'select'
                                                ) as HTMLSelectElement
                                            onCreateLight(
                                                text.value,
                                                select.value
                                            )

                                            document
                                                .getElementById('my_modal_1')!
                                                .close()
                                        }}
                                    >
                                        Create
                                    </button>
                                </div>
                            </dialog>
                        </li>
                        <li>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={onAvatarFile}
                            />
                            <label htmlFor="fileInput">Avatar</label>
                        </li>

                        <li>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={onStageFile}
                            />
                            <label htmlFor="fileInput">Stage</label>
                        </li>

                        <li>
                            <input
                                type="file"
                                id="input"
                                style={{ display: 'none' }}
                                onChange={onMeshFile}
                            />
                            <label htmlFor="input">Mesh</label>
                        </li>

                        <li>
                            <button
                                id="addbutton"
                                onClick={() => {
                                    editor.rttManager.addRtt().then()
                                }}
                            >
                                Add Rtt
                            </button>
                        </li>
                    </ul>
                </div>

                <label
                    className="flex items-center px-4 py-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                    onClick={() => {
                        const serializedScene = SceneSerializer.Serialize(
                            editor.scene
                        )
                        const strScene = JSON.stringify(serializedScene)
                        const blob = new Blob([strScene], {
                            type: 'octet/stream',
                        })

                        const objectUrl = (
                            window.webkitURL || window.URL
                        ).createObjectURL(blob)
                        const download = document.createElement('a')
                        document.body.appendChild(download)
                        download.href = objectUrl
                        download.name = 'scene.babylon'
                        download.download = 'scene.babylon'
                        download.click()
                    }}
                >
                    QWET
                </label>
            </div>
        </div>
    )
}
