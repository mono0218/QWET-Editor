import {NextRequest, NextResponse} from "next/server"
import {useParams} from "next/navigation";
import {getServerSession} from "next-auth/next";
import {options} from "../../../../../../auth.config";
import {userDB} from "@/lib/user/userDB";
const userdb = new userDB()
export async function GET(req:NextRequest,{ params }: { params: { id: string } }) {

    const result = await userdb.Get({id:Number(params.id)})

    if (result != null){
        return NextResponse.json({data:result}, { status: 200 })
    }else{
        return NextResponse.json({message:"NotFound"},{status:404})
    }
}

export async function PUT(req:NextRequest,{params}: {params:{id:string}}){
    const session = await getServerSession(options)

    if(params.id === session.user.id){

        const formData = await req.formData()

        const result = await userdb.Update({
            id:Number(session.user.id),
            content:formData.get("content") as string
        })

        return  NextResponse.json({message: "success"}, {status: 200})
    }
}
