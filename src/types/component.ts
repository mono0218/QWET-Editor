import { QwetObject } from '@/types/object'
import { JSX } from 'react'
import { QwetUiComponent } from '@/types/uiComponent'

export interface QwetComponent {
    object: QwetObject | undefined
    uiComponentList: Array<QwetUiComponent>

    init: () => void
    update: () => void
    destroy: () => void

    ui: () => JSX.Element
}
