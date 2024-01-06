"use server"
import React from "react";
import {cookies} from "next/headers";
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs'
import {Database} from "../../database.types";
import {Guest,Login} from "@/components/navconponent";


export default async function App() {
    const supabase = createServerComponentClient<Database>({cookies})
    const {data:{session}} = await supabase.auth.getSession()
    if (session === null){
        return(
            <Guest/>
        )
    }else{
        return(
            <Login/>
        )
    }
}