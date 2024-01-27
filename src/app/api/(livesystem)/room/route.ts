import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {options} from "@/../auth.config";
import {ImageStorage} from "@/lib/common/imageStorage";
import {v4} from "uuid"
import {RoomDB, roomDB} from "@/lib/room/roomDB";
import {stageDB} from "@/lib/stage/stageDB";
import {motionDB} from "@/lib/motion/motionDB";

const db = new roomDB()

export async function POST(req:NextRequest){
    const session = await getServerSession(options)
    const formData = await req.formData()

    type Props ={
        uuid: string;
        apiUrl: string;
        masterKey: string;
        userKey: string;
        avatarUrl: string,
        motionUUID: string,
        movieUrl: string,
        stageUUID: string,
        userId:number;
    }

    const uuid:string = v4();

    //formDataをPropsに変換
    const data:Props={
        uuid:uuid,
        apiUrl: "",
        masterKey: "",
        userKey: "",

        avatarUrl: formData.get("avatarUrl") as string,
        motionUUID: formData.get("motionUUID") as string,
        movieUrl: formData.get("movieUrl") as string,
        stageUUID: formData.get("stageUUID") as string,
        userId:Number(session.user.id as string)
    }

    //SongleAPIにmovieURL対応しているかの確認
    const songleResult = await fetch(`https://widget.songle.jp/api/v1/song.json?url=${data.movieUrl}`)
    const songleJson = await songleResult.json()

    if(!songleJson.url){
        return NextResponse.json({message:"Songle Not Register"},{status:400})
    }

    //motionUUIDとstageUUIDが存在するかの確認
    const stagedb = new stageDB()
    const motiondb = new motionDB()

    try{
        Promise.all([
            stagedb.Get({uuid:data.stageUUID}),
            motiondb.Get({uuid:data.motionUUID}),
        ]).then((values) => {
            console.log(values);
        });
    }catch (e){
        return NextResponse.json({message:"Stage or Motion Notfound"},{status:400})
    }


    //DataBaseへの挿入データを作成
    const dbData:RoomDB = {
        uuid:data.uuid,
        userId:data.userId,
        apiUrl:data.apiUrl,
        masterKey:data.masterKey,
        userKey:data.userKey,

        movieUrl:data.movieUrl,
        avatarUrl:data.avatarUrl,
        motionUUID:data.motionUUID,
        stageUUID:data.stageUUID,
    }

    try {
        await db.Create(dbData)
        return NextResponse.json({message:"Success Created",uuid:uuid},{status:200})
    } catch {
        return NextResponse.json({message:"Database Error"},{status:500})
    }
}
