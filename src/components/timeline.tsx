import React, { useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

type TimelineItem = {
    id: number
    name: string
    startTime: number // 単位は秒
    duration: number // 単位は秒
}

const ItemTypes = {
    TIMELINE_ITEM: 'timelineItem',
}

// ドラッグ可能なタイムラインアイテム
const DraggableTimelineItem: React.FC<{
    item: TimelineItem
    pixelsPerSecond: number
    index: number
    onMoveItem: (id: number, newStartTime: number) => void
}> = ({ item, pixelsPerSecond, index, onMoveItem }) => {
    const [, drag] = useDrag({
        type: ItemTypes.TIMELINE_ITEM,
        item: { id: item.id },
    })

    const [, drop] = useDrop({
        accept: ItemTypes.TIMELINE_ITEM,
        hover: (draggedItem: { id: number }, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset()
            const initialClientOffset = monitor.getInitialClientOffset()
            const currentClientOffset = monitor.getClientOffset()

            if (!delta || !initialClientOffset || !currentClientOffset) return

            // ドラッグによる変位 (左方向の変位)
            const deltaX = currentClientOffset.x - initialClientOffset.x

            // ピクセル変位を秒数に変換
            const newStartTime = item.startTime + deltaX / pixelsPerSecond

            if (newStartTime >= 0) {
                onMoveItem(item.id, newStartTime)
            }
        },
    })

    return (
        <div
            ref={(node) => drag(drop(node))}
            className="timeline-item absolute bg-blue-500 text-white rounded-md cursor-move"
            style={{
                left: `${item.startTime * pixelsPerSecond}px`,
                width: `${item.duration * pixelsPerSecond}px`,
                top: `${index * 40}px`, // 各レイヤーの高さ調整
                height: '38px',
                zIndex: 1,
            }}
        >
            {item.name}
        </div>
    )
}

const Timeline: React.FC = () => {
    const [items, setItems] = useState<TimelineItem[]>([
        { id: 1, name: 'Layer 1', startTime: 0, duration: 5 },
        { id: 2, name: 'Layer 2', startTime: 2, duration: 4 },
        { id: 3, name: 'Layer 3', startTime: 4, duration: 6 },
        { id: 4, name: 'Layer 4', startTime: 7, duration: 3 },
        { id: 5, name: 'Layer 5', startTime: 10, duration: 5 },
        { id: 6, name: 'Layer 6', startTime: 12, duration: 7 },
        { id: 7, name: 'Layer 7', startTime: 14, duration: 2 },
        { id: 8, name: 'Layer 8', startTime: 16, duration: 4 },
        { id: 9, name: 'Layer 9', startTime: 18, duration: 3 },
        { id: 10, name: 'Layer 10', startTime: 20, duration: 6 },
    ])

    const timelineDuration = 20 // 20秒間のタイムライン
    const timelineWidth = 800 // タイムラインの幅(px)
    const pixelsPerSecond = timelineWidth / timelineDuration // 1秒あたりのピクセル数

    // レイヤー名を更新する関数
    const handleNameChange = (id: number, newName: string) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        )
    }

    // アイテムを移動する関数
    const handleMoveItem = (id: number, newStartTime: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, startTime: Math.max(newStartTime, 0) }
                    : item
            )
        )
    }

    return (
        <DndProvider backend={HTML5Backend} >
            <div className="timeline-editor h-[300px] w-screen overflow-x-scroll overflow-y-scroll p-4 flex">
                <div>
                    {items.map((item) => (
                        <div key={item.id} className="mb-2">
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                    handleNameChange(item.id, e.target.value)
                                }
                                className="border rounded p-1 w-full"
                                placeholder={`Layer ${item.id}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="timeline-body relative">
                    {/* 背景グリッド */}
                    <div
                        className="absolute top-0 left-0 w-full h-full "
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)',
                            backgroundSize: '40px 40px', // グリッドのサイズ（1マス = 1秒）
                            backgroundRepeat: 'repeat',
                            zIndex: 0,
                        }}
                    ></div>

                    {/* タイムラインアイテム */}
                    {items.map((item, index) => (
                        <DraggableTimelineItem
                            key={item.id}
                            item={item}
                            pixelsPerSecond={pixelsPerSecond}
                            index={index}
                            onMoveItem={handleMoveItem}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    )
}

export default Timeline
