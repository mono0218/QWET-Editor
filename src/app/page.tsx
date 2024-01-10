"use server"
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "../../database.types";
import React from "react";
import MainCard from "@/components/MainCard";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {data: {session}} = await supabase.auth.getSession()
    return(
        <div>
          {session ? <div>ログイン</div> : <div>未ログイン</div>}
        </div>


    )
}
