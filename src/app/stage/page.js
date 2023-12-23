import { cookies } from 'next/headers'
import MainCard from "@/components/MainCard.js";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import {redirect} from "next/navigation";


export default async function Home() {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const user = await supabase.auth.getSession()

    if (user.data.session){
        let json
        await fetch("http://localhost:3000/api/stage/get", {cache: "no-store"}).then(response => response.json()).then((data)=>{
            json = data
        })

        return(
            <MainCard {...json}/>
        )
    }
    redirect("/login")

}
