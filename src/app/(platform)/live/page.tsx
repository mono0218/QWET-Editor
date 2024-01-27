"use client"

import {Button, Image, ScrollShadow} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {useRouter} from "next/navigation";
import AvatarCard from "@/components/avatar/avatarCard";
import {useEffect, useState} from "react";
import {Session} from "next-auth";
import {getSession} from "next-auth/react";
import {stageCardType} from "@/components/stage/stageCard";
import {motionCardType} from "@/components/motion/motionCard";
import AvatarCardList from "@/components/avatar/avatarCardList";
import Link from "next/link";
import {CharacterModel} from "@/types/vroidAPI.types";

export default function Page(){
    const { push } = useRouter()
    const [Data, setData] = useState([])

    useEffect(() => {
        (async () => {
            const avatarData = await fetch("/api/avatar/like?count=36")
            const _avatar = await avatarData.json()
            const avatar = _avatar.data
            setData(avatar)
            console.log(avatar)
        })()
    }, []);

    const onSubmit = async (event)=>{
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/live', {
            method: 'POST',
            body: formData,
        })

        const result = await response.json()
        if(result.status === 200){
            push(`/live/${result.data.uuid}`)
        }
    }

    return (
        <div className="ml-72 mr-72 mt-10">
            {Data?(<div>
                <form onSubmit={onSubmit} className="grid gap-10 items-center">
                    <h1 className="text-4xl font-bold text-center pb-5">ライブをつくる！！</h1>
                    <Input
                        isRequired
                        type="string"
                        label="ステージUUID"
                        name="stageUUID"
                    />

                    <Input
                        isRequired
                        type="string"
                        label="モーションUUID"
                        name="motionUUID"
                    />

                    <Input
                        isRequired
                        type="url"
                        label="楽曲URL"
                        name="movieUrl"
                    />

                    <h1 className="text-2xl font-bold text-center">アバター選択</h1>
                        <ScrollShadow className="w-full h-[400px]">
                            <div className="grid gap-x-8 gap-y-4 grid-cols-6">
                                {Data.map((_data:CharacterModel) =>
                                    <Link href={`https://hub.vroid.com/characters/${_data.character.id}/models/${_data.id}`} target={"_blank"}>
                                        <div className="flex felx-col max-w-[170px]">
                                            <Image isZoomed src={_data.portrait_image.w600.url2x}></Image>
                                        </div>

                                        <p className={"mt-3"}>{_data.character.name}</p>
                                    </Link>
                                )}
                            </div>
                        </ScrollShadow>
                    <Button type="submit">次へ</Button>
                </form>
            </div>) : (<p>Now Loading...</p>)}
        </div>

    )
}
