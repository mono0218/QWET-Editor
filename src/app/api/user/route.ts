import {NextRequest, NextResponse} from "next/server";
import {userDB} from "@/lib/db/user";
import {getServerSession} from "next-auth/next";
import {options} from "../../../../auth.config";
import Next from "next-auth/src";

export async function POST(req:NextRequest){
    const userdb = new userDB()
    const session = await getServerSession(options)

    if(!session){
        //認証がされていない場合
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const user = await userdb.Get({
        id:Number(session.user.id)})

    if(user != null){
        //userテーブルに既に存在する場合
        return NextResponse.json({message:"Already　Created"},{status:409})
    }else if(user === null){
        const result = await userdb.Create({
            id:session.user.id,
            name:session.user.name,
            iconUrl:session.user.image
        })
        return NextResponse.json({message:"Success Created"},{status:201})
    }
}
