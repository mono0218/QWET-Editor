"use server"
import Home from './getvrm';
import {getServerSession} from "next-auth/next";
import {options} from "../../auth.config";
import {getHeartModel, getUserPostModel} from "../lib/vroid/VroidInfo";

export default async function Page() {
    const session = await getServerSession(options)
    let a

    if(session.user!= null){
        a = await getHeartModel(session.user.accessToken)
    }

    return(
        <>
            <Home {...a}></Home>
        </>
    )
}
