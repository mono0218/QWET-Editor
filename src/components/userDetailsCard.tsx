import {CharacterModel} from "@/types/vroidAPI.types";
import {Avatar, Button, Image, Link} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import UserContentUpdateModal from "@/components/userContentModel";

export type UserDetailsType = {
    userId:number;
    name:string;
    content:string;
    imageUrl:string;
}

export default function UserDetailsCard(data:UserDetailsType){
    const [isAuthor,setisAuthor] = useState(false)

    useEffect( () => {
        (async()=>{
            const session = await getSession()
            if(Number(session.user.id) === data.userId){
                setisAuthor(true)
            }
        })()
    }, []);
    return(
        <>
            <div>
                <div className="w-full h-48 bg-blue-400 z-0　relative"/>

                <div className="flex justify-between">
                    <div>
                        <div className="flex flex-1">
                            <div className=" inline-block -mt-16 w-32 ml-12">
                                <Avatar src={data.imageUrl}
                                        className={"w-52 h-52"}></Avatar>
                            </div>
                        </div>
                        <div>
                            <p className="ml-12 text-2xl font-bold p-1">{data.name}</p>
                            <Link href={`https://pixiv.net/users/${data.userId}`}
                                  className={"ml-12"}>https://pixiv.net/users/{data.userId}</Link>
                        </div>
                    </div>

                    <div>
                        <h1>{data.content}</h1>
                    </div>

                    <div>
                        {isAuthor?(<UserContentUpdateModal id={data.userId}/>):(<></>)}
                    </div>
                </div>
            </div>
        </>
    )
}
