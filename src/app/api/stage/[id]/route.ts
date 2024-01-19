import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {stageDB} from "@/lib/db/stage";
import {json} from "node:stream/consumers";
import {options} from "../../../../../auth.config";
import {userDB} from "@/lib/db/user";
import {MotionStorage} from "@/lib/storage/motion";
import {v4} from "uuid"
import {StageStorage} from "@/lib/storage/stage";

export async function GET(req:NextRequest,{params}: {params:{id:string}}){
    const session = await getServerSession(options)
    const stagedb = new stageDB(session)

    const result = await stagedb.Get({id:params.id})
    return NextResponse.json({data:result},{status:200})
}

export async function PUT(req:NextRequest,{params}: {params:{id:string}}){
    const session = await getServerSession(options)
    const formData = await req.formData()

    if(!session){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const stagedb = new stageDB(session)
    const stage = await stagedb.Get({id:params.id})
    const autherid = stage.userId


    if (String(autherid) != session.user.id){
        return NextResponse.json({message:"Forbidden"},{status:403})
    }else if(String(autherid) === session.user.id){
        const uuid = v4();
        const stageStorage = new StageStorage()

        const file: any = formData.get("file");
        const buffer = Buffer.from(await file?.arrayBuffer());

        await stageStorage.update({
            id:uuid,
            buffer:buffer
        })

        const result = await stagedb.Update({
            id:session.user.id,
            name: String(formData.get("name")),
            content: String(formData.get("content")),
            url: `motion/${uuid}/${uuid}.glb`,
            license: String(formData.get("license"))
        })

        return NextResponse.json({message:"Success"},{status:200})
    }
}

export async function DELETE(req:NextRequest,{params}:{params:{id:string}}){
    const session = await getServerSession(options)

    if(!session){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const stagedb = new stageDB(session)
    const stage = await stagedb.Get({id:params.id})
    const autherid = stage.userId

    if (String(autherid) != session.user.id){
        return NextResponse.json({message:"Forbidden"},{status:403})
    }else if(String(autherid) === session.user.id){
        const stageStorage = new StageStorage()

        await stageStorage.remove({
            url:stage.url,
        })

        const result = await stagedb.Remove({id:params.id})
        return NextResponse.json({message:"Success"},{status:200})
    }
}
