import {CharacterModel} from "@/types/vroidAPI.types";
import {Image} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function AvatarCard(data){
    const { push } = useRouter();
    console.log(data)
    return(
        <>
            <Link href={`https://hub.vroid.com/characters/${data.character_model.id}/models/${data.id}`} target={"_blank"}>
                <div className="flex felx-col max-w-[170px]">
                    <Image isZoomed src={data.character_model.portrait_image.w600.url2x}></Image>
                </div>

                <p className={"mt-3"}>{data.character_model.character.name}</p>
            </Link>
        </>
    )
}
