"use client"
import AvatarCard from "@/components/avatar/avatarCard";
import {CharacterModel} from "@/types/vroidAPI.types";

export default function AvatarCardList({data}:{data:Array<CharacterModel>}){
    return(
        <>
            <h2 className={"text-xl mb-10 font-bold"}>おすすめのアバター</h2>

            <div className="grid gap-x-8 gap-y-4 grid-cols-6">
                {data.map((_data)=>
                    <AvatarCard {..._data}/>
                )}
            </div>
        </>
    )
}
