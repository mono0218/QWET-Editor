import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {options} from "../../../../auth.config";
import {motionDB} from "@/lib/db/motion";
import { v4 } from "uuid";
import {MotionStorage} from "@/lib/storage/motion";

export async function POST(req:NextRequest){
    const session = await getServerSession(options)
    const formData = await req.formData()

    if(!session){
        //認証がされていない場合
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }else{
        const motiondb = new motionDB(session)
        const uuid = v4();

        const motionStorage = new MotionStorage()

        const file: any = formData.get("file");
        const buffer = Buffer.from(await file?.arrayBuffer());

        await motionStorage.create({
            id:uuid,
            buffer:buffer
        })

        const result = await motiondb.Create({
            name: String(formData.get("name")),
            content: String(formData.get("content")),
            url: `motion/${uuid}/${uuid}.glb`,
            license: String(formData.get("license"))
        })
        return NextResponse.json({message:"Success Created"},{status:200})
    }
}
