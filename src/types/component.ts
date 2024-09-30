import { QwetObject } from '@/types/object'
import { JSX } from 'react'

export interface QwetComponent {
    object: QwetObject
    uiComponentList: Array<JSX.Element>

    init: () => void
    update: () => void
    destroy: () => void

    ui: () => JSX.Element
}
