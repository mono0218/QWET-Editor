import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {options} from "../../../../../auth.config";
import {userDB} from "@/lib/user/userDB";

export async function POST(){
    const userdb = new userDB()
    const session = await getServerSession(options)

    const user = await userdb.Get({id:Number(session.user.id)})

    if(user != null){
        //userテーブルに既に存在する場合
        return NextResponse.json({message:"Already　Created"},{status:409})

    }else if(user === null){

        await userdb.Create({
            id:Number(session.user.id),
            name:session.user.name,
            url:session.user.image,
        })

        return NextResponse.json({message:"Success Created"},{status:201})
    }
}
