import { QwetUiComponent } from '@/types/uiComponent'
import { AvatarComponent } from '@/components/objects/mesh/mmd/avatarComponent'
import React from 'react'

export class MmdSettings implements QwetUiComponent {
    AvatarComponent: AvatarComponent
    constructor(AvatarComponent: AvatarComponent) {
        this.AvatarComponent = AvatarComponent
    }

    getUI(): JSX.Element {
        const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.currentTarget.files
            if (!files || files?.length === 0) return

            for (const file of files) {
                if (file.name.endsWith('.vmd')) {
                    this.AvatarComponent.addMmdAnimation('animation', file)
                }
            }
        }

        return (
            <>
                <input type="file" onChange={onFile} />
                <button
                    onClick={this.AvatarComponent.stopMmdAnimation}
                ></button>
            </>
        )
    }
}
