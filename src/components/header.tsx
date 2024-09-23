import { SceneSerializer } from '@babylonjs/core'
import React from 'react'
import { QwetEditor } from '@/lib/Editor'

export default function Header({ editor }: { editor: QwetEditor }) {
    const onAvatarFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files

        for (const file of files) {
            if (file.name.endsWith('.bpmx')) {
                editor.mmdManager.loadAvatar(file).then()
            }
        }
    }

    const onStageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        for (const file of files) {
            if (file.name.endsWith('.bpmx')) {
                editor.mmdManager.loadStage(file).then()
            }
        }
    }

    const onMotionFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files || files?.length === 0) return

        const file = files[0]

        if (file.name.endsWith('.vmd')) {
            editor.mmdManager.loadMotion(file).then()
        }
    }

    const onMeshFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files || files?.length === 0) return

        const file = files[0]
        editor.meshManager.addMeshFile(file)
    }

    const onCreateLight = (text: string, select: string) => {
        switch (select) {
            case 'DirectionalLight':
                editor.lightManager.addDirectionalLight(text)
                break
            case 'HemisphericLight':
                editor.lightManager.addHemisphericLight(text)
                break
            case 'SpotLight':
                editor.lightManager.addSpotLight(text)
                break
            case 'PointLight':
                editor.lightManager.addPointLight(text)
                break
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
                                        .getElementById('my_modal_1')
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
                                                .getElementById('my_modal_1')
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
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={onMotionFile}
                            />
                            <label htmlFor="fileInput">Motion</label>
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
