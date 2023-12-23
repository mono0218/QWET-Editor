import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export async function getCurrentUser(){
    const supabase = createClientComponentClient()
    const {data} = await supabase.auth.getSession()
    if (data.session === null){
        redirect("/login")
    }else{
        return data
    }
}