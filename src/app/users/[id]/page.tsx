"use client"
import {signIn} from "next-auth/react";
import AvatarInfo from "@/components/avatarInfo";
import {CharacterModel} from "@/types/vroidAPI.types";
import StageInfo from "@/components/stageInfo";
import UserInfo from "@/components/userInfo";

export default function Home(data:Array<CharacterModel>) {

    return(
        <>
            <div className="ml-32 mr-32">
                <UserInfo/>

                <div className="mt-5">
                    <h2 className={"text-xl mt-10 mb-5 font-bold"}>ステージ</h2>

                    <div className="flex justify-between gap-8 mb-5">
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                    </div>

                    <div className="flex justify-between gap-8">
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                    </div>
                </div>

                <div>
                    <h2 className={"text-xl mt-10 mb-5 font-bold"}>モーション</h2>

                    <div className="flex justify-between gap-8 mb-5">
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                    </div>

                    <div className="flex justify-between gap-8">
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                        <StageInfo></StageInfo>
                    </div>
                </div>
            </div>
        </>
    )
}
