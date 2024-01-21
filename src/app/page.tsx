"use server"
import {getServerSession} from "next-auth/next";
import {options} from "../../auth.config";
import {getHeartModel} from "@/lib/vroid/VroidInfo";
import AvatarCardList from "@/components/avatar/avatarCardList";
import StageCardList from "@/components/stage/stageCardList";
import MotionCardList from "@/components/motion/motionCardList";

export default async function Page() {
    const session = await getServerSession(options)
    let data

    if(session != null){
        data = await getHeartModel(session.user.accessToken)
    }

    return(
        session?(
                <>
                    <div className="ml-32 mr-32">

                        <div className="mt-[450px]">
                            <AvatarCardList/>
                        </div>

                        <div>
                            <StageCardList/>
                        </div>

                        <div className="mt-10">
                            <MotionCardList/>
                        </div>

                    </div>
                </>
            ):
        (<></>)
    )
}
