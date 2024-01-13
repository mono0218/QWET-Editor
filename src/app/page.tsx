"use client"
import {signIn, signOut, useSession} from 'next-auth/react'

export default function Home() {
    const session = useSession()
    console.log(session)
    if(session.data != null){
        fetch("https://hub.vroid.com/api/staff_picks",{
            mode:"no-cors",
            headers:{
                "X-Api-Version":"11",
                "Authorization": `Bearer ${session.data.token.access_token}`
            }
        }).then((data)=>{console.log(data)})
    }
    const SignInHandle = async ()=>{
        await signIn("vroid")
    }
    return(
        <>
            <button onClick={SignInHandle}>aaa</button>
        </>
    )
}
