import { QwetEditor } from '@/components/Editor'
import SceneSetting from '@/components/scene/sceneSetting'
import React from 'react'

export default function ObjectSettingMenu({
    editor,
    uniqueId,
}: {
    editor: QwetEditor
    uniqueId: number
}) {
    const object = editor.objectList.find((i) => i.uniqueId == uniqueId)

    if (uniqueId == 0) {
        return <SceneSetting scene={editor.scene} />
    } else if (!object) {
        return <></>
    }

    return (
        <>
            <div>
                {object.components.map((component) => {
                    return component.uiComponentList.reverse().map((uiComponent) => {
                        const UI = uiComponent.getUI()
                        return (
                            <React.Fragment key={object.uniqueId}>
                                {UI}
                            </React.Fragment>
                        )
                    })
                })}
            </div>
        </>
    )
}
