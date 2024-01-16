"use client"
import {signIn, useSession} from "next-auth/react";

export default function Home(a:any) {
    console.log(a)

    const SignInHandle = async ()=>{
        await signIn("vroid")
    }

    return(
        <>
            <button onClick={SignInHandle}>aaa</button>
        </>
    )
}
