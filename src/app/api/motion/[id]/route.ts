import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {motionDB} from "@/lib/db/motion";
import {json} from "node:stream/consumers";
import {options} from "../../../../../auth.config";
import {userDB} from "@/lib/db/user";
import {MotionStorage} from "@/lib/storage/motion";
import {v4} from "uuid"


export async function GET(req:NextRequest){
    const session = await getServerSession(options)
    const motiondb = new motionDB(session)
    const json = await req.json()

    return await motiondb.Get(json.id)
}

export async function PUT(req:NextRequest,{params}: {params:{id:string}}){
    const session = await getServerSession(options)
    const formData = await req.formData()

    if(!session){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const motiondb = new motionDB(session)
    const stage = await motiondb.Get({id:params.id})
    const autherid = stage.userId



    if (String(autherid) != session.user.id){
        return NextResponse.json({message:"Forbidden"},{status:403})
    }else if(String(autherid) === session.user.id){
        const uuid = v4();

        const motionStorage = new MotionStorage()

        const file: any = formData.get("file");
        const buffer = Buffer.from(await file?.arrayBuffer());

        await motionStorage.update({
            id:uuid,
            buffer:buffer
        })

        const result = await motiondb.Update({
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

    const motiondb = new motionDB(session)
    const stage = await motiondb.Get({id:params.id})
    const autherid = stage.userId

    if (String(autherid) != session.user.id){
        return NextResponse.json({message:"Forbidden"},{status:403})
    }else if(String(autherid) === session.user.id){
        const motionStorage = new MotionStorage()

        await motionStorage.remove({
            url:stage.url,
        })

        const result = await motiondb.Remove({id:params.id})
        return NextResponse.json({message:"Success"},{status:200})
    }
}
