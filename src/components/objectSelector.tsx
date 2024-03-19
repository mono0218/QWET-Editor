export default function ObjectSelector() {
    return (
        <>
            <div className="w-72 bg-gray-800 p-4 text-white">
                <div className="mb-4 flex">
                    <button className="flex-1 rounded-md bg-transparent px-4 py-2 hover:bg-gray-700 focus:outline-none">
                        Scene
                    </button>
                </div>
                <div className="p-4">
                    <ul className="m-0 list-none p-0">
                        <li className="mb-2">
                            <div className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">
                                <span className="font-bold">Main Camera</span>
                                <button className="focus:outline-none">
                                    &#9660;
                                </button>
                            </div>
                        </li>
                        <li className="mb-2">
                            <div className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">
                                <span className="font-bold">
                                    Directional Light
                                </span>
                                <button className="focus:outline-none">
                                    &#9660;
                                </button>
                            </div>
                        </li>
                        <li className="mb-2">
                            <div className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">
                                <span className="font-bold">Cube</span>
                                <button className="focus:outline-none">
                                    &#9660;
                                </button>
                            </div>
                            <ul className="m-0 hidden list-none p-0 pl-4">
                                <li>
                                    <div className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">
                                        <span className="font-bold">
                                            Sphere
                                        </span>
                                        <button className="focus:outline-none">
                                            &#9660;
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li className="mb-2">
                            <div className="flex cursor-pointer items-center justify-between rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">
                                <span className="font-bold">Plane</span>
                                <button className="focus:outline-none">
                                    &#9660;
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
