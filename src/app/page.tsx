"use client"

import AvatarCardList from "@/components/avatar/avatarCardList";
import StageCardList from "@/components/stage/stageCardList";
import MotionCardList from "@/components/motion/motionCardList";
import {stageCardType} from "@/components/stage/stageCard";
import {motionCardType} from "@/components/motion/motionCard";
import {StageDBTypes} from "@/types/stageDB.types";
import {MotionDBTypes} from "@/types/motionDB.types";
import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import {Session} from "next-auth";
import { useRouter } from "next/navigation";

type ReturnStageData ={
    data:Array<StageDBTypes>
}

type ReturnMotionData ={
    data:Array<MotionDBTypes>
}

export default function Page() {

    const [Data, setData] = useState(undefined)
    const [session,setSession] = useState<Session>()

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const _session:Session =await getSession()
            if(_session === null){
                await  router.push(`/api/auth/signin`)
            }

            setSession(session)
            const avatarData = await fetch("/api/avatar?count=12")
            const stageData = await fetch("/api/stage?count=6")
            const motionData = await fetch("/api/motion?count=6")

            const _avatar = await avatarData.json()
            const stage: ReturnStageData = await stageData.json()
            const motion: ReturnMotionData = await motionData.json()

            const avatar = _avatar.data
            const stageList: Array<stageCardType> = []
            const motionList: Array<motionCardType> = []

            stage.data.map((data) => {
                const _data: stageCardType = {
                    id: data.uuid,
                    name: data.name,
                    imageUrl: data.imageUrl,
                }
                stageList.push(_data)
            })

            motion.data.map((data) => {
                const _data: motionCardType = {
                    id: data.uuid,
                    name: data.name,
                    imageUrl: data.imageUrl,
                }
                motionList.push(_data)
            })

            setData({
                avatar,
                stageList,
                motionList
            })
        })()
    }, []);

    return(
        <div>
            {session?.user?(
                <></>
            ):(
                Data?(<>
                    <div className="ml-32 mr-32">

                        <div className="mt-[450px]">
                            <AvatarCardList data={Data.avatar}/>
                        </div>
                        <div className="mt-24">
                            <StageCardList data={Data.stageList}/>
                        </div>

                        <div className="mt-24">
                            <MotionCardList data={Data.motionList}/>
                        </div>

                    </div>
                </>):(<>Now Loading</>)
            )}
            
        </div>
    )
}
