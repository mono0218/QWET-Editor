import { QwetComponent } from '@/types/component'

// タイムラインクリップのユニオン型
export type TimelineClip =
    | MmdTimelineClip
    | EffectTimelineClip
    | MoveTimelineClip
    | SoundTimelineClip;

export interface  ClipsData {
    start: number;
    end: number;
}


export interface BaseTimelineClip {
    track: number;
    uniqueId: string;
    class: QwetComponent;
    clips: [
        ClipsData
    ];
    keys?: [
        {
            key: number;
        },
    ];
    isDragging?: boolean;
}

export interface MmdTimelineClip extends BaseTimelineClip {
    type: "mmd";
    clips:[
        {
            start: number;
            end: number;
            data: MmdClipData;
        },
    ],
    keys?:[
        {
            key: number;
            data: MmdClipData;
        },
    ]
}

export interface EffectTimelineClip extends BaseTimelineClip {
    type: "effect";
    clips:[
        {
            start: number;
            end: number;
            data: EffectClipData;
        },
    ],
    keys?:[
        {
            key: number;
            data: EffectClipData;
        },
    ]
}

export interface MoveTimelineClip extends BaseTimelineClip {
    type: "move";
    clips:[
        {
            start: number;
            end: number;
            data: MoveClipData;
        },
    ],
    keys?:[
        {
            key: number;
            data: MoveClipData;
        },
    ]
}

export interface SoundTimelineClip extends BaseTimelineClip {
    type: "sound";
    clips:[
        {
            start: number;
            end: number;
            data: SoundClipData;
        },
    ],
    keys?:[
        {
            key: number;
            data: SoundClipData;
        },
    ]
}

export interface MmdClipData {
    animationName: string;
}

export interface EffectClipData {
    // EffectClipData固有のプロパティを定義
}

export interface MoveClipData {
    // MoveClipData固有のプロパティを定義
}

export interface SoundClipData {
    // SoundClipData固有のプロパティを定義
}
