import {Image} from "@nextui-org/react";

export type stageCardType={
    id:string;
    name:string;
    imageUrl:string;
}


export default function StageCard(data:stageCardType){
    return(
        <>
            <div>
                <div className="flex felx-col max-w-[340px]">
                    <Image className={"p-0 m-0"} src={data.imageUrl}></Image>
                </div>

                <p className={"mt-3"}>{data.name}</p>
            </div>

        </>
    )
}
