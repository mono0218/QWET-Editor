import {NextRequest, NextResponse} from "next/server"
import {getServerSession} from "next-auth/next";
import {options} from "../../../../auth.config";

export async function GET(req:NextRequest,) {
    const session = await getServerSession(options)

    return NextResponse.json({name:session.user.name})
}

