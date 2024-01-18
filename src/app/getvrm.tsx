"use client"
import {signIn} from "next-auth/react";
import AvatarInfo from "@/components/avatarInfo";
import {CharacterModel} from "@/types/vroidAPI.types";
import StageInfo from "@/components/stageInfo";

export default function Home(data:Array<CharacterModel>) {

    const SignInHandle = async ()=>{
        await signIn("vroid")
    }

    return(
        <>
            <div className="ml-32 mr-32">
                <div className="mt-[450px]">
                    <h2 className={"text-xl mb-10 font-bold"}>おすすめのアバター</h2>

                    <div className="flex justify-between gap-8 mb-3">
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                    </div>

                    <div className="flex justify-between gap-8">
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                        <AvatarInfo {...data[1]}></AvatarInfo>
                    </div>
                </div>


                <div>
                    <h2 className={"text-xl mt-10 mb-10 font-bold"}>おすすめのステージ</h2>

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
                    <h2 className={"text-xl mt-10 mb-10 font-bold"}>おすすめのモーション</h2>

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
