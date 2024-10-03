import React, { useEffect, useState } from 'react'
import {
    Timeline,
    TimelineInteractionMode,
    TimelineModel,
    TimelineOptions,
    TimelineRow,
    TimelineRowStyle,
} from 'animation-timeline-js'

interface TimelineRowWithTitle extends TimelineRow {
    title?: string
}

type ContainerProps = {
    rows: TimelineRowWithTitle[]
}

function ReactTimeline(props: ContainerProps) {
    const [_timeline, setTimeline] = useState<Timeline | null>(null)
    const [options, setOptions] = useState<TimelineOptions | null>(null)
    const [scrollHeight, setScrollHeight] = useState<number>()
    const [scrollContainerDiv, setScrollContainerDiv] =
        useState<HTMLDivElement | null>(null)

    function selectMode() {
        if (_timeline) {
            _timeline.setInteractionMode(TimelineInteractionMode.Selection)
        }
    }

    function zoomMode() {
        if (_timeline) {
            _timeline.setInteractionMode(TimelineInteractionMode.Zoom)
        }
    }

    function panMode() {
        if (_timeline) {
            _timeline.setInteractionMode(TimelineInteractionMode.Pan)
        }
    }

    useEffect(() => {
        if (!_timeline) {
            const model = { rows: props.rows } as TimelineModel
            const options = {
                id: 'timeline',
                rowsStyle: {
                    height: 35,
                    marginBottom: 2,
                } as TimelineRowStyle,
            } as TimelineOptions
            setOptions(options)
            const timeline = new Timeline(options, model)
            setTimeline(timeline)
            setScrollHeight(timeline?._scrollContainer?.scrollHeight)
        }

        if (scrollContainerDiv) {
            scrollContainerDiv.addEventListener('wheel', (e) => {
                _timeline?._handleWheelEvent(e)
            })
            _timeline?.onScroll((e) => {
                console.log(e.scrollTop)
                scrollContainerDiv.scrollTop = e.scrollTop
            })
        }

        if (_timeline) {
            document.addEventListener('keydown', (args) => {
                if (
                    (args.which === 65 || args.which === 97) &&
                    _timeline._controlKeyPressed(args)
                ) {
                    _timeline.selectAllKeyframes()
                    args.preventDefault()
                }
            })
        }

        return () => {
            scrollContainerDiv?.removeEventListener('wheel', () => {})
            document.removeEventListener('keydown', () => {})
        }
    }, [scrollContainerDiv])

    return (
        <>
            <div className="bg-[#1e1e1e] text-[#adadad]　h-48 text-xs overflow-hidden flex flex-col">
                <div className="toolbar bg-[#3c3c3c] pl-11 flex items-center relative">
                    <button
                        className="button p-0 w-11 min-w-11 mr-1 text-[#adadad] bg-transparent hover:bg-[#201616] focus:outline-none border-none"
                        onClick={selectMode}
                    >
                        tab_unselected
                    </button>
                    <button
                        className="button p-0 w-11 min-w-11 mr-1 text-[#adadad] bg-transparent hover:bg-[#201616] focus:outline-none border-none"
                        onClick={panMode}
                    >
                        pan_tool
                    </button>
                    <button
                        className="button p-0 w-11 min-w-11 mr-1 text-[#adadad] bg-transparent hover:bg-[#201616] focus:outline-none border-none"
                        onClick={zoomMode}
                    >
                        search
                    </button>
                </div>

                <footer className="flex">
                    <div className="outline flex flex-col w-[250px] min-w-[150px]">
                        <div
                            className="outline-header"
                            style={{
                                minHeight: options?.rowsStyle?.height + 'px',
                                maxHeight: options?.rowsStyle?.height + 'px',
                                marginTop: '-5px',
                            }}
                        ></div>

                        <div
                            className="overflow-y-auto h-full"
                            ref={(ref) => setScrollContainerDiv(ref)}
                        >
                            <div
                                className="outline-items"
                                style={{ minHeight: scrollHeight }}
                            >
                                {props.rows.map((row, index) => (
                                    <div
                                        key={index}
                                        className="outline-node px-5 text-sm flex items-center w-full text-white select-none h-[30px] hover:bg-[#3399ff]"
                                        style={{
                                            marginBottom:
                                                options?.rowsStyle
                                                    ?.marginBottom,
                                            minHeight:
                                                options?.rowsStyle?.height +
                                                'px',
                                            maxHeight:
                                                options?.rowsStyle?.height +
                                                'px',
                                        }}
                                    >
                                        {row.title || 'Track ' + index}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div id="timeline" className="flex-grow"></div>
                </footer>
            </div>
        </>
    )
}

export default ReactTimeline

export const rows = [
    {
        selected: false,
        draggable: false,

        keyframes: [
            {
                val: 40,
                shape: 'rhomb',
            },
            {
                shape: 'rhomb',
                val: 3000,
                selected: false,
            },
        ],
    },
    {
        selected: false,
        hidden: false,
        keyframes: [
            {
                cursor: 'default',
                val: 2000,
            },
            {
                val: 2500,
            },
            {
                val: 2600,
            },
        ],
    },
    {
        hidden: false,
        keyframes: [
            {
                val: 1000,
            },
            {
                val: 1500,
            },
            {
                val: 2000,
            },
        ],
    },
    {
        title: 'Groups (Limited)',
        keyframes: [
            {
                val: 40,
                max: 850,
                group: 'a',
            },
            {
                val: 800,
                max: 900,
                group: 'a',
            },
            {
                min: 1000,
                max: 3400,
                val: 1900,
                group: 'b',
            },
            {
                val: 3000,
                max: 3500,
                group: 'b',
            },
            {
                min: 3500,
                val: 4000,
                group: 'c',
            },
        ],
    },
    {
        keyframes: [
            {
                val: 100,
            },
            {
                val: 3410,
            },
            {
                val: 2000,
            },
        ],
    },
    {
        title: 'Style Customized',
        groupHeight: 20,
        keyframesStyle: {
            shape: 'rect',
            width: 5,
            height: 20,
        },
        keyframes: [
            {
                val: 90,
            },
            {
                val: 3000,
            },
        ],
    },
    {},
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
