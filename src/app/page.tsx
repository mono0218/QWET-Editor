"use server"
import Home from './getvrm';
import {getServerSession} from "next-auth/next";
import {options} from "../../auth.config";
import {getHeartModel} from "@/lib/vroid/VroidInfo";
export default async function Page() {
    const session = await getServerSession(options)
    let data

    if(session != null){
        data = await getHeartModel(session.user.accessToken)
    }

    return(
        session?(
                <>
                    <Home {...data.data}></Home>
                </>
            ):
        (<></>)
    )
}
