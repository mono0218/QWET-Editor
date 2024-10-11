import React, { useEffect, useRef } from 'react'
import { QwetEditor } from '@/components/Editor'
import TimeLineCanvas from '@/TimeLineCanvas'

export default function ReactTimeline({ editor }: { editor: QwetEditor }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const timelineWrapperRef = useRef<HTMLDivElement>(null)
    let isScrolling = false // スクロール中のフラグ

    useEffect(() => {
        const canvas = canvasRef.current
        const timelineWrapper = timelineWrapperRef.current

        if (canvas && timelineWrapper) {
            // キャンバスの初期化は一度だけ行う
            canvas.width = 5000
            editor.timeline = new TimeLineCanvas(canvas, timelineWrapper)

            // スクロールイベントに requestAnimationFrame を使用
            const handleScroll = () => {
                if (!isScrolling) {
                    isScrolling = true

                    requestAnimationFrame(() => {
                        editor.timeline.render(0)
                        isScrolling = false
                    })
                }
            }

            timelineWrapper.addEventListener('scroll', handleScroll)

            return () => {
                timelineWrapper.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    return (
        <div
            ref={timelineWrapperRef}
            style={{
                overflowX: 'scroll',
                whiteSpace: 'nowrap',
                width: '100%',
                height: '300px',
                position: 'relative',
            }}
        >
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}
