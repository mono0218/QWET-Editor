import {CharacterModel} from "@/types/vroidAPI.types";
import {Image} from "@nextui-org/react";

export default function AvatarInfo(data:CharacterModel){
    return(
        <>
            <div>
                <div className="flex felx-col max-w-[170px]">
                    <Image  className={"p-0 m-0"} src={data.portrait_image.w300.url}></Image>
                </div>

                <p className={"mt-3"}>{data.name}</p>
            </div>
        </>
    )
}
