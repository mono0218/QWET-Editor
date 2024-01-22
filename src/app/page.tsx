"use server"
import {getServerSession} from "next-auth/next";
import {options} from "../../auth.config";
import {getHeartModel} from "@/lib/vroid/VroidInfo";
import AvatarCardList from "@/components/avatar/avatarCardList";
import StageCardList from "@/components/stage/stageCardList";
import MotionCardList from "@/components/motion/motionCardList";
import {stageCardType} from "@/components/stage/stageCard";
import {motionCardType} from "@/components/motion/motionCard";
import {StageDBTypes} from "@/types/stageDB.types";
import {MotionDBTypes} from "@/types/motionDB.types";

type ReturnStageData ={
    data:Array<StageDBTypes>
}

type ReturnMotionData ={
    data:Array<MotionDBTypes>
}

export default async function Page() {
    const session = await getServerSession(options)
    if(session === null){
        return(
            <>
            </>
        )
    }

    const avatarData =  await getHeartModel(session.user.accessToken)
    const stageData = await fetch("http://localhost:3000/api/stage?count=6")
    const motionData = await fetch("http://localhost:3000/api/motion?count=6")

    const avatar = avatarData.data
    const stage:ReturnStageData = await stageData.json()
    const motion:ReturnMotionData = await motionData.json()

    let stageList:Array<stageCardType> = []
    let motionList:Array<motionCardType> = []
    stage.data.map((data)=>{
        const _data:stageCardType = {
            id:data.uuid,
            name:data.name,
            imageUrl:data.imageUrl,

        }
        stageList.push(_data)
    })

    motion.data.map((data)=>{
        const _data:motionCardType = {
            id:data.uuid,
            name:data.name,
            imageUrl:data.imageUrl,

        }
        motionList.push(_data)
    })
    return(
        session?(
                <>
                    <div className="ml-32 mr-32">

                        <div className="mt-[450px]">
                            <AvatarCardList data={avatar}/>
                        </div>
                        <div>
                            <StageCardList data={stageList}/>
                        </div>

                        <div className="mt-10">
                            <MotionCardList data={motionList}/>
                        </div>

                    </div>
                </>
            ):
        (<></>)
    )
}
