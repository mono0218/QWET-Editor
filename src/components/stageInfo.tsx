import {Image} from "@nextui-org/react";

export default function StageInfo(){
    return(
        <>
            <div>
                <div className="flex felx-col max-w-[340px]">
                    <Image className={"p-0 m-0"} src={"/img.png"}></Image>
                </div>

                <p className={"mt-3"}>stage 01</p>
            </div>

        </>
    )
}
