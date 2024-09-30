import { QwetEditor } from '@/components/Editor'
import React from 'react'
import SceneSetting from '@/components/scene/sceneSetting'

export default function ObjectSettingMenu({
    editor,
    uniqueId,
}: {
    editor: QwetEditor
    uniqueId: number
}) {
    const object = editor.objectList.find((obj) => obj.uniqueId === uniqueId)

    if (uniqueId == 0) {
        return <SceneSetting scene={editor.scene} />
    } else if (!object) {
        return <></>
    }

    return (
        <>
            {object.components.map((component) => {
                const Component: JSX.Element = component.ui()
                return (
                    <React.Fragment key={component.object.uniqueId}>
                        {Component}
                    </React.Fragment>
                )
            })}
        </>
    )
}
