'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import {AuthResponse, AuthTokenResponsePassword} from "@supabase/gotrue-js";
import {Database} from "../../../../database.types";
import Link from "next/link";

export default function Login() {
    const supabase = createClientComponentClient<Database>()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [Error,setError] = useState<string>()

    const handleSignIn = async () => {
        const data:AuthTokenResponsePassword = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if(data.error){
            setError(data.error.message)
        }else{
            router.push("/")
        }
    }

    return (
        <>
            <div className={"h-screen flex flex-col justify-center items-center"}>
                <p className={"text-5xl text-center p-14"}>ログイン</p>
                <div className={" w-1/4 flex flex-col gap-10"}>
                    <Input className={""} label="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <Input
                        type="password"
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} />
                    {Error ? <p className={"text-red-700"}>{Error}</p> : <></>}

                    <div className={"flex flex-col gap-5"}>
                            <Button onClick={handleSignIn}>Log in</Button>
                    </div>

                    <Link href={"/signup"} className={"text-center"}>アカウント作成はこちら</Link>
                </div>
            </div>
        </>
    )
}
