import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {options} from "../../../../../auth.config";
import {motionDB} from "@/lib/motion/motionDB";
import {ImageStorage} from "@/lib/common/imageStorage";
import {MotionStorage} from "@/lib/motion/motionStorage";
const db = new motionDB()
const fileStorage = new MotionStorage()
const imageStorage = new ImageStorage()

export async function GET(req:NextRequest,{params}: {params:{id:string}}){
    try{
        const result = await db.Get({uuid:params.id})

        if(result === null){
            return NextResponse.json({message:"NotFound"},{status:404})
        }

        return NextResponse.json({data:result},{status:200})
    }catch{
        return NextResponse.json({message:"Database Error"},{status:500})
    }
}

export async function DELETE(req:NextRequest,{params}:{params:{id:string}}){
    const result = await db.Get({uuid: params.id})
    const session = await getServerSession(options)

    if(result.userId != Number(session.user.id)) {
        return NextResponse.json({message: "Forbidden"}, {status: 403})
    }


    try{
        await fileStorage.remove({url:result.fileUrl})
        await imageStorage.remove({url:result.imageUrl})
    }catch {
        return NextResponse.json({message:"R2 Storage Error"},{status:500})
    }

    try{
        await db.Remove({
            uuid: result.uuid,
            userId: Number(session.user.id)
        })
        return NextResponse.json({message:"Success Removed"},{status:200})
    }catch{
        return NextResponse.json({message:"Database Error"},{status:500})
    }
}
