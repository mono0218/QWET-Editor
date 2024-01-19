import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {options} from "../../../../auth.config";
import {stageDB} from "@/lib/db/stage";
import {MotionStorage} from "@/lib/storage/motion";
import {v4} from "uuid"
import {StageStorage} from "@/lib/storage/stage";

export async function POST(req:NextRequest){
    const session = await getServerSession(options)
    console.log(session)
    const formData = await req.formData()

    if(!session){
        //認証がされていない場合
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }else{
        const stagedb = new stageDB(session)

        const uuid = v4();

        const stageStorage = new StageStorage()

        const file: any = formData.get("file");
        const buffer = Buffer.from(await file?.arrayBuffer());

        await stageStorage.create({
            id:uuid,
            buffer:buffer
        })

        const result = await stagedb.Create({
            name: String(formData.get("name")),
            content: String(formData.get("content")),
            url: `stage/${uuid}/${uuid}.glb`,
            license: String(formData.get("license"))
        })
        return NextResponse.json({message:"Success Created"},{status:200})
    }
}
