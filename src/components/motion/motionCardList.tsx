import StageUploadModal from "@/components/stage/stageUploadModal";
import MotionCard, {motionCardType} from "@/components/motion/motionCard";

export default function MotionCardList(data:Array<motionCardType>){
    return(
        <>
            <div className="flex justify-between">
                <h2 className={"text-xl mb-10 font-bold"}>おすすめのモーション</h2>
                <StageUploadModal/>
            </div>

            <div className="grid gap-x-8 gap-y-4 grid-cols-3">
                {data.map((_data)=>
                    <MotionCard {..._data}/>
                )}
            </div>

        </>
    )
}
