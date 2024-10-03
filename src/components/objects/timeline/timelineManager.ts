import {
    Timeline,
    TimelineInteractionMode,
    TimelineOptions, TimelineRow,
    TimelineRowStyle,
} from 'animation-timeline-js'
import { QwetEditor } from '@/components/Editor'
import { AvatarComponent } from '@/components/objects/mesh/mmd/avatarComponent'

interface QwetTimelineData  {
    type: string
    title: string
    id: string
    itemId: string
    class: AvatarComponent
    data: string
    min: number
    max: number
}

export class TimeLineManager {
    editor: QwetEditor
    timeLineEditorData:  TimelineRow[] = []
    timelineEditor: Timeline | null = null
    timelineOptions: TimelineOptions | undefined
    timelineData: QwetTimelineData[] = []

    constructor(editor: QwetEditor) {
        this.editor = editor
    }

    init(element: HTMLElement) {
        this.timelineOptions = {
            id: element,
            rowsStyle: {
                height: 35,
                marginBottom: 2,
            } as TimelineRowStyle,
        } as TimelineOptions

        this.timelineEditor = new Timeline(this.timelineOptions, { rows: this.timeLineEditorData })

        this.timelineEditor.onDragFinished((row, keyframe) => {
            console.log('onDragFinished', row, keyframe)
        })

        setTimeout(() => {
            this.play()
        }, 30000)
    }

    play() {
        let i = 0;
        const interval = 10;
        setInterval(() => {
            this.timelineEditor?.setTime(i);
            const data = this.timelineData.filter((item) => item.min <= i && item.max >= i)

            data.map((item) => {
                if (item.type === 'mmd') {
                    item.class.playMmdAnimation(item.data.name)
                }
            })
            i += interval;
        }, interval);

    }

    addMmdMotion(name: string, max: number,avatarClass: AvatarComponent) {
        this.timeLineEditorData.push({
            title: name,
            type: 'mmd',
            id: name,
            itemId: name,
            data:"",
            min: max,
            max: max,
            keyframesDraggable: true,
            keyframes: [
                {
                    val: 0,
                    draggable: false,
                },
                {
                    val: max,
                    draggable: false,
                },
            ]
        })

        this.timelineData.push({
            title: name,
            type: 'mmd',
            id: name,
            itemId: name,
            class:avatarClass,
            data: { name: name },
            min: 0,
            max: max,
        })

        this.timelineEditor?.setModel(
            { rows: this.timeLineEditorData }
        )
    }

    selectMode() {
        if (this.timelineEditor) {
            this.timelineEditor.setInteractionMode(TimelineInteractionMode.Selection)
        }
    }

    zoomMode() {
        if (this.timelineEditor) {
            this.timelineEditor.setInteractionMode(TimelineInteractionMode.Zoom)
        }
    }

    panMode() {
        if (this.timelineEditor) {
            this.timelineEditor.setInteractionMode(TimelineInteractionMode.Pan)
        }
    }
}
