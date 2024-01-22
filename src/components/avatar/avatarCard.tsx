import {CharacterModel} from "@/types/vroidAPI.types";
import {Image} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function AvatarCard(data:CharacterModel){
    const { push } = useRouter();
    return(
        <>
            <Link href={`https://hub.vroid.com/characters/${data.character.id}/models/${data.id}`} target={"_blank"}>
                <div className="flex felx-col max-w-[170px]">
                    <Image isZoomed src={data.portrait_image.w600.url2x}></Image>
                </div>

                <p className={"mt-3"}>{data.character.name}</p>
            </Link>
        </>
    )
}
