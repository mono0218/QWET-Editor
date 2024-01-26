"use client"

import {Button, Image} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {useRouter} from "next/navigation";

export default function Page(){
    const { push } = useRouter()
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
            <div>
                <form onSubmit={onSubmit} className="grid gap-10 items-center">
                    <h1 className="text-4xl font-bold text-center pb-5">ライブをつくる！！</h1>
                    <Input
                        isRequired
                        type="string"
                        label="ライブ名"
                        name="name"
                    />

                    <Input
                        isRequired
                        type="string"
                        label="説明文"
                        name="content"
                    />

                    <Input
                        isRequired
                        type="file"
                        label="画像"
                        name="image"
                    />

                    <Input
                        isRequired
                        type="url"
                        label="楽曲URL"
                        name="movieUrl"
                    />

                    <h1 className="text-2xl font-bold text-center">アセット情報</h1>

                    <Button type="submit">次へ</Button>
                </form>
            </div>
        </div>

    )
}
