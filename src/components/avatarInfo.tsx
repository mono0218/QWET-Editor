import {CharacterModel} from "@/types/vroidAPI.types";
import {Image} from "@nextui-org/react";

export default function AvatarInfo(data:CharacterModel){
    return(
        <>
            <div>
                <div className="flex felx-col max-w-[170px]">age.w
                </div>

                <p className={"mt-3"}>{data.name}</p>
            </div>
        </>
    )
}
