"use client"
import React, {useEffect, useState} from "react";
import StageDetailsCard, {StageDetailsType} from "@/components/stage/StageDetailsCard";


export default function Page({params}: {params:{id:string}}){
    const [Data,setData] = useState<StageDetailsType>()
    const [isData,setisData] = useState(false)
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        (async() => {
            const response = await fetch(`/api/stage/${params.id}`);
            const data = await response.json()

            if(response.status === 200){
                console.log(data)
                setisData(true)

                const _data:StageDetailsType = {
                    uuid:data.data.uuid,
                    name:data.data.name,
                    content:data.data.content,
                    license:data.data.license,
                    imageUrl:data.data.imageUrl,
                    userId:Number(data.data.userId),
                    username:data.data.user.name,
                }

                setData(_data)
                setLoading(false)
            }else {
                setLoading(false)
                setisData(false)
            }
        })()
    },[]);

    return (
        <div>
            {Loading?(
                <p className="text-center text-xl">Now Loading...</p>
            ):(
                <div>
                    {isData?(
                        <div className="ml-32 mr-32">
                            <StageDetailsCard {...Data}/>
                        </div>
                    ):(
                        <p className="text-center text-xl">データーが存在しません</p>
                    )}
                </div>

            )}
        </div>
    )
}
