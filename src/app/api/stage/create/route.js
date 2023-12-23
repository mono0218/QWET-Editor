import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server';
export async function POST(request,{params}) {
    let data = {token:"GVkVZDMb8PPnioN3NiDBHPdhhCYvzYG"}
    let _response
    await fetch("https://api.songle.jp/api/v2/apps/2457/stages.json?token=GVkVZDMb8PPnioN3NiDBHPdhhCYvzYGz",{
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store" }).then((response) => response.json()).then((data) => {_response = data})
    return NextResponse.json(_response.data)
}