"use server"
import Image from 'next/image'
import {createClientComponentClient, createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "../../database.types";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {data: {session}} = await supabase.auth.getSession()
    return(
        <div>
          {session ? <div>ログイン</div> : <div>未ログイン</div>}
        </div>
    )
}
