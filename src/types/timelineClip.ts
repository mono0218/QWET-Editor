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
        },
    ],
    keys?:[
        {
            key: number;
        },
    ]
}

export interface LightTimelineClip extends BaseTimelineClip {
    type: "light";
    clips:[
        {
            start: number;
            end: number;
            data: LightClipData;
        },
    ],
    keys?:[
        {
            key: number;
            data: LightClipData;
        },
    ]
}

export interface MmdClipData {
    animationName: string;
}

export interface EffectClipData {
    position:{
        x: number;
        y: number;
        z: number;
    }
}

export interface LightClipData {
    position:{
        x: number;
        y: number;
        z: number;
    }

    color: string;
    strong: number;
    width: string;
    height: string;
}

export interface MoveClipData {
    position:{
        x: number;
        y: number;
        z: number;
    }

    objectUniqueId: string;
}
