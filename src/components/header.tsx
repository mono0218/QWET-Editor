import { Scene } from '@babylonjs/core'
import { importObject } from '../lib/object/importObject'

export default function Header({ scene }: { scene: Scene }) {
    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files || files?.length === 0) return

        const file = files[0]

        importObject({
            scene: scene,
            name: file.name,
            file: file,
        })
    }

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">My Project</h1>
            <div className="relative">
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={onChangeFile}
                />
                <label
                    htmlFor="fileInput"
                    className="flex items-center px-4 py-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Import File
                </label>
            </div>
        </div>
    )
}
