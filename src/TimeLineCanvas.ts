import { ClipsData, TimelineClip } from '@/types/timelineClip'
import { AvatarComponent } from '@/components/objects/mesh/mmd/avatarComponent'
import { QwetComponent } from '@/types/component'

export default class TimeLineCanvas {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private timelineWrapper: HTMLDivElement
    private time: number = 0
    private totalTime: number = 100 // 全体の時間
    private trackCount: number = 6 // トラックの数
    private scrollOffset: number = 0 // スクロールオフセット
    private topPadding: number = 20 // メモリ表示のための上部余白
    private readonly trackHeight: number // 各トラックの高さ
    private clips: TimelineClip[] = []
    private isDragging: boolean = false // クリップをドラッグ中か
    private selectedClip: {
        TimelineClip: TimelineClip
        clip: ClipsData
    } | null = null // 選択されたクリップ

    constructor(canvas: HTMLCanvasElement, timelineWrapper: HTMLDivElement) {
        this.canvas = canvas
        this.timelineWrapper = timelineWrapper
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        this.canvas.width = 40000
        this.canvas.height = 300
        this.trackHeight = canvas.height / this.trackCount

        this.setupEventListeners()

        this.render(this.time)
    }

    addMmdClip(
        animationName: string,
        uniqueId: number,
        component: AvatarComponent,
        end: number
    ): void {
        const trackNumber = this.clips[-1].track.valueOf() + 1
        this.clips.push({
            track: trackNumber,
            type: 'mmd',
            uniqueId: uniqueId.toString(),
            class: component,
            clips: [
                {
                    start: 0,
                    end: end,
                    data: {
                        animationName: animationName,
                    },
                },
            ],
        })

        this.render(this.time)
    }

    addEffectClip(
        position: { x: number; y: number; z: number },
        end: number,
        effectClass: QwetComponent
    ): void {
        const trackNumber = this.clips[-1].track.valueOf() + 1
        this.clips.push({
            track: trackNumber,
            type: 'effect',
            uniqueId: '1',
            class: effectClass,
            clips: [
                {
                    start: 0,
                    end: end,
                    data: {
                        position: position,
                    },
                },
            ],
        })

        this.render(this.time)
    }

    addSoundClip(
        soundName: string,
        end: number,
        soundClass: QwetComponent
    ): void {
        const trackNumber = this.clips[-1].track.valueOf() + 1
        this.clips.push({
            track: trackNumber,
            type: 'sound',
            uniqueId: '2',
            class: soundClass,
            clips: [
                {
                    start: 0,
                    end: end,
                },
            ],
        })

        this.render(this.time)
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('mousedown', (event) =>
            this.onMouseDown(event)
        )
        this.canvas.addEventListener('mousemove', (event) =>
            this.onMouseMove(event)
        )
        this.canvas.addEventListener('mouseup', () => this.onMouseUp())
        this.canvas.addEventListener('contextmenu', (event) =>
            this.onMouseContextMenu(event)
        )
        this.timelineWrapper.addEventListener('scroll', () => this.onScroll())
    }

    private onMouseContextMenu(event: MouseEvent): void {
        event.preventDefault()
        /*
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const data = this.getClipAtPosition(x, y);
         */
    }

    private onMouseDown(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const data = this.getClipAtPosition(x, y)
        if (data) {
            this.isDragging = true
            this.selectedClip = { clip: data.clip, TimelineClip: data.clips }
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.isDragging && this.selectedClip) {
            const rect = this.canvas.getBoundingClientRect()
            const x = event.clientX - rect.left

            const newStart =
                (x / this.canvas.width) * this.totalTime +
                (this.scrollOffset / this.canvas.width) * this.totalTime
            const clipLength =
                this.selectedClip.clip.end - this.selectedClip.clip.start

            this.selectedClip.TimelineClip.clips.map((clip) => {
                if (this.selectedClip?.clip.start === clip.start) {
                    clip.start = newStart
                    clip.end = newStart + clipLength
                }
            })

            this.render(0)
        }
    }

    private onMouseUp(): void {
        this.isDragging = false
        this.selectedClip = null
    }

    private onScroll(): void {
        this.scrollOffset = this.timelineWrapper.scrollLeft
        this.render(0)
    }

    private getClipAtPosition(
        x: number,
        y: number
    ): { clips: TimelineClip; clip: ClipsData } | null {
        let returnData = null

        this.clips.map((clips) => {
            return clips.clips.map((clip) => {
                const xStart =
                    (clip.start / this.totalTime) * this.canvas.width -
                    this.scrollOffset
                const xEnd =
                    (clip.end / this.totalTime) * this.canvas.width -
                    this.scrollOffset
                const clipYStart = clips.track * this.trackHeight
                const clipYEnd = clipYStart + this.trackHeight

                if (
                    x >= xStart &&
                    x <= xEnd &&
                    y - this.topPadding >= clipYStart &&
                    y - this.topPadding <= clipYEnd
                ) {
                    returnData = { clips, clip }
                }
            })
        })

        return returnData
    }

    private drawHorizontalLines(): void {
        this.ctx.strokeStyle = '#555'
        this.ctx.lineWidth = 1

        for (let i = 0; i < this.trackCount; i++) {
            const y = i * this.trackHeight + this.topPadding
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(this.canvas.width, y)
            this.ctx.stroke()
        }
    }

    private drawTimeIndicators(scrollOffset: number): void {
        const step = 100
        this.ctx.strokeStyle = '#fff'
        this.ctx.fillStyle = '#fff'
        this.ctx.font = '12px Arial'

        for (
            let i = -scrollOffset;
            i < this.canvas.width + scrollOffset;
            i += step
        ) {
            const x = i + scrollOffset
            const timeLabel = ((x + scrollOffset) / 100).toFixed(1)

            this.ctx.beginPath()
            this.ctx.moveTo(x, this.topPadding)
            this.ctx.lineTo(x, this.topPadding + 10)
            this.ctx.stroke()

            this.ctx.fillText(timeLabel, x - 5, this.topPadding - 5)
        }
    }

    private drawVerticalGrid(scrollOffset: number): void {
        this.ctx.strokeStyle = '#444'
        this.ctx.lineWidth = 0.5

        for (
            let i = -scrollOffset;
            i < this.canvas.width + scrollOffset;
            i += 10
        ) {
            const x = i + scrollOffset
            if ((x + scrollOffset) % 100 === 0) {
                this.ctx.strokeStyle = '#888'
                this.ctx.lineWidth = 1
            } else {
                this.ctx.strokeStyle = '#444'
                this.ctx.lineWidth = 0.5
            }
            this.ctx.beginPath()
            this.ctx.moveTo(x, this.topPadding + 10)
            this.ctx.lineTo(x, this.canvas.height)
            this.ctx.stroke()
        }
    }

    private drawClips(scrollOffset: number): void {
        console.log(this.clips)
        this.clips.forEach((clips) => {
            clips.clips.forEach((clip) => {
                const { start, end } = clip
                const track = clips.track
                const xStart =
                    (start / this.totalTime) * this.canvas.width - scrollOffset
                const xEnd =
                    (end / this.totalTime) * this.canvas.width - scrollOffset
                const y = track * this.trackHeight + this.topPadding

                this.ctx.fillStyle = '#1E90FF'
                this.ctx.fillRect(
                    xStart,
                    y + 5,
                    xEnd - xStart,
                    this.trackHeight - 10
                )
            })
        })
    }

    render(currentTime: number): void {
        console.log(currentTime)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawTimeIndicators(this.scrollOffset)
        this.drawHorizontalLines()
        this.drawVerticalGrid(this.scrollOffset)
        this.drawClips(this.scrollOffset)
    }
}
