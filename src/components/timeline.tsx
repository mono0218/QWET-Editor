import React, { useEffect, useRef } from 'react'
import { QwetEditor } from '@/components/Editor'

export default function ReactTimeline({editor}:{editor:QwetEditor}) {
    const scrollable1Ref = useRef<HTMLDivElement>(null);
    const scrollable2Ref = useRef<HTMLDivElement>(null);

    const syncScroll = (source: 'scrollable1' | 'scrollable2') => {
        const sourceDiv = source === 'scrollable1' ? scrollable1Ref.current : scrollable2Ref.current;
        const targetDiv = source === 'scrollable1' ? scrollable2Ref.current : scrollable1Ref.current;

        if (sourceDiv && targetDiv) {
            targetDiv.scrollTop = sourceDiv.scrollTop;
            targetDiv.scrollLeft = sourceDiv.scrollLeft;
        }
    };

    useEffect(() => {
        editor.timeline.init(document.getElementById('timeline') as HTMLElement)
    }, [])

    return (
        <>
            <div className="bg-[#1e1e1e] text-[#adadad]　h-1 text-xs overflow-hidden flex flex-col">
                <div className="toolbar bg-[#3c3c3c] pl-11 flex items-center relative">
                    <button
                        className="button p-0 w-11 min-w-11 mr-1 text-[#adadad] bg-transparent hover:bg-[#201616] focus:outline-none border-none"
                        onClick={editor.timeline.selectMode}
                    >
                        tab_unselected
                    </button>
                    <button
                        className="button p-0 w-11 min-w-11 mr-1 text-[#adadad] bg-transparent hover:bg-[#201616] focus:outline-none border-none"
                        onClick={editor.timeline.panMode}
                    >
                        pan_tool
                    </button>
                    <button
                        className="button p-0 w-11 min-w-11 mr-1 text-[#adadad] bg-transparent hover:bg-[#201616] focus:outline-none border-none"
                        onClick={editor.timeline.zoomMode}
                    >
                        search
                    </button>
                </div>

                <footer className="flex">
                    {editor.timeline && editor.timeline.timelineOptions && editor.timeline.timeLineEditorData ?(
                    <div className="outline flex flex-col w-[250px] min-w-[150px] ">
                        <div
                            className="outline-header"
                            style={{
                                minHeight: editor.timeline.timelineOptions!.rowsStyle?.height + 'px',
                                maxHeight: editor.timeline.timelineOptions!.rowsStyle?.height + 'px',
                                marginTop: '-5px',
                            }}
                        ></div>

                        <div
                            className="overflow-auto h-72"
                        >
                            <div
                                className="outline-items"
                                ref={scrollable1Ref}
                                onScroll={()=>{syncScroll("scrollable1")}}
                            >
                                {editor.timeline.timeLineEditorData.map((row, index) => (
                                    <div
                                        key={index}
                                        className="outline-node px-5 text-sm flex items-center w-full text-white select-none hover:bg-[#3399ff]"
                                        style={{
                                            marginBottom:
                                            editor.timeline.timelineOptions!.rowsStyle?.marginBottom,
                                            minHeight:
                                                editor.timeline.timelineOptions!.rowsStyle?.height +
                                                'px',
                                            maxHeight:
                                                editor.timeline.timelineOptions!.rowsStyle?.height +
                                                'px',
                                        }}
                                    >
                                        {row.title || 'Track ' + index}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    ):(<></>)}
                    <div id="timeline" className="flex-grow" ref={scrollable2Ref} onScroll={()=>{syncScroll("scrollable2")}}></div>
                </footer>
            </div>
        </>
    )
}
