"use client"
import {signIn} from "next-auth/react";
import AvatarCard from "@/components/avatar/avatarCard";
import {CharacterModel} from "@/types/vroidAPI.types";
import StageCard from "@/components/stage/stageCard";
import UserDetailsCard, {UserDetailsType} from "@/components/userDetailsCard";
import React, {useEffect, useState} from "react";

export default function Page({params}: {params:{id:string}}) {
    const [Data,setData] = useState<UserDetailsType>({})
    const [isData,setisData] = useState(false)
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        (async() => {
            const response = await fetch(`/api/user/${params.id}`);
            const data = await response.json()

            if(response.status === 200){
                setisData(true)
                console.log(data)
                const _data:UserDetailsType = {
                    userId:data.data.id,
                    name:data.data.name,
                    content:data.data.content,
                    imageUrl:data.data.iconUrl
                }

                setData(_data)
                setLoading(false)
            }else {
                setLoading(false)
                setisData(false)
            }
        })()
    },[]);


    return(
        <>
            {Loading?(
                <p className="text-center text-xl">Now Loading...</p>
            ):(
                <div>
                    {isData?(
                        <div className="ml-32 mr-32">
                            <UserDetailsCard {...Data}/>

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
                    ):(
                        <p className="text-center text-xl">データーが存在しません</p>
                    )}
                </div>
            )}
        </>
    )
}
