import { QwetObject } from '@/types/object'
import { JSX } from 'react'

export interface QwetComponent {
    object: QwetObject

    init: () => void
    update: () => void
    destroy: () => void

    ui: () => JSX.Element
}
