import {Avatar, Button, Link} from "@nextui-org/react";
import React from "react";
import {Image} from "@nextui-org/react"
import {Card} from "@nextui-org/card";

export default function StageDetailsCard(){
    return(
        <>
            <div className="flex flex-col">
                <Image src="/img.png" className="w-max items items-center"></Image>

                <div className="flex justify-between">
                    <div>
                        <p className="pt-6 text-2xl font-bold p-1">幻想的なステージその１</p>
                        <p className="pt-6 text-xl p-1">ここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入ります</p>
                    </div>

                    <div className="flex flex-col gap-6 ml-10">
                        <p className="pt-6 text-base font-bold">ライセンス:</p>
                        <p className="pt-6 text-base font-bold">投稿者:</p>
                        <Button color="primary">ステージのIDをコピーする</Button>
                        <Button color="danger">このステージを削除する</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
