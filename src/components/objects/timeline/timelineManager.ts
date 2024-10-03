import {
    Timeline,
    TimelineInteractionMode,
    TimelineOptions,
    TimelineRow,
    TimelineRowStyle,
} from 'animation-timeline-js'
import { QwetEditor } from '@/components/Editor'

export class TimeLineManager {
    editor: QwetEditor
    timeLineEditorData: TimelineRow[] = rows
    timelineEditor: Timeline | null = null
    timelineOptions: TimelineOptions | undefined
    constructor(editor: QwetEditor) {
        this.editor = editor
    }

    init(element: HTMLElement) {
        console.log(element)
        this.timelineOptions = {
            id: element,
            rowsStyle: {
                height: 35,
                marginBottom: 2,
            } as TimelineRowStyle,
        } as TimelineOptions
        this.timelineEditor = new Timeline(this.timelineOptions,{rows: this.timeLineEditorData})

        this.timelineEditor.onTimeChanged((time) => {
            console.log(time)
        })
        this.play()
    }

    play() {
        let i = 0;
        const interval = 10; // ミリ秒単位での間隔

        setInterval(() => {
            // オプショナルチェーンで timelineEditor が存在する場合のみ setTime を呼び出す
            this.timelineEditor?.setTime(i);
            i += interval;
        }, interval);
    }


    addMmdMotion(name:string,max:number){
        this.timeLineEditorData.push({
            title: name,
            type: 'mmd',
            min: max,
            max: max,
            keyframesDraggable: false,
            keyframes: [
                {
                    val: 0,
                },
                {
                    val: max,
                },
            ]
        })

        this.timelineEditor?.setModel(
            {rows: this.timeLineEditorData}
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

const rows = [
    {
        title: 'Max Value',
        max: 4000,
        keyframes: [
            {
                width: 4,
                height: 20,
                group: 'block',
                shape: 'rect',
                fillColor: 'Red',
                strokeColor: 'Black',
                val: 4000,
                selectable: false,
                draggable: false,
            },
            {
                val: 1500,
            },
            {
                val: 2500,
            },
        ],
    },
] as TimelineRow[]
