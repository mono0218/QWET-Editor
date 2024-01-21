"use client"
import {signIn} from "next-auth/react";
import AvatarCard from "@/components/avatar/avatarCard";
import {CharacterModel} from "@/types/vroidAPI.types";
import StageCard from "@/components/stage/stageCard";
import UserDetailsCard from "@/components/userDetailsCard";

export default function Home(data:Array<CharacterModel>) {

    return(
        <>
            <div className="ml-32 mr-32">
                <UserDetailsCard/>

                <div className="mt-5">
                    <h2 className={"text-xl mt-10 mb-5 font-bold"}>ステージ</h2>

                    <div className="flex justify-between gap-8 mb-5">
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                    </div>

                    <div className="flex justify-between gap-8">
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                    </div>
                </div>

                <div>
                    <h2 className={"text-xl mt-10 mb-5 font-bold"}>モーション</h2>

                    <div className="flex justify-between gap-8 mb-5">
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                    </div>

                    <div className="flex justify-between gap-8">
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                        <StageCard></StageCard>
                    </div>
                </div>
            </div>
        </>
    )
}
