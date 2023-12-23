import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server';
import {useRouter} from "next/navigation";

export async function GET(request,{params}) {
    let data = {token:"GVkVZDMb8PPnioN3NiDBHPdhhCYvzYG"}
    let _response
    await fetch("https://api.songle.jp/api/v2/apps/2457/stages.json?token=GVkVZDMb8PPnioN3NiDBHPdhhCYvzYGz",{
        method: "GET", cache: "no-store" })
        .then((response) => response.json()).then((data) => {_response = data})
    return NextResponse.json(_response)
}