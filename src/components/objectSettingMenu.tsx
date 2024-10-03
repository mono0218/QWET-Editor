import { QwetEditor } from '@/components/Editor'
import React from 'react'

export default function ObjectSettingMenu({
    editor,
    uniqueId,
}: {
    editor: QwetEditor
    uniqueId: number
}) {
    const object = editor.objectList.find((obj) => obj.uniqueId === uniqueId)
    if (!object) return <></>

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
