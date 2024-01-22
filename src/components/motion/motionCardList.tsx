"use client"
import StageUploadModal from "@/components/stage/stageUploadModal";
import MotionCard, {motionCardType} from "@/components/motion/motionCard";
import {stageCardType} from "@/components/stage/stageCard";
import MotionUploadModal from "@/components/motion/motionUploadModal";

export default function MotionCardList({data}:{data:Array<motionCardType>}){
    return(
        <>
            <div className="flex justify-between">
                <h2 className={"text-xl mb-10 font-bold"}>おすすめのモーション</h2>
                <MotionUploadModal/>
            </div>

            <div className="grid gap-x-8 gap-y-4 grid-cols-3">
                {data.map((_data)=>
                    <MotionCard {..._data}/>
                )}
            </div>

        </>
    )
}
