"use client"
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Dropdown,
    DropdownTrigger, Avatar, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import {getServerSession} from "next-auth/next";
import {options} from "../../auth.config";
import {getSession} from "next-auth/react";
import React, {useState} from "react";
import { useRouter } from "next/navigation";

export function Nav(){
    const router = useRouter();
    const session =  getSession().then((data)=>{
        if(data != null){
            setLogin(true)
        }
    })

    const [isLogin,setLogin] = useState(false)

    const onclick = (key)=> {
        console.log(key)
        if(key === "mypage"){
            router.push("/users/70762708")
        }else if(key === "notification"){
            router.push("/users/70762708")
        }else if(key === "logout") {
            router.push("/api/auth/signout")
        }
    }

    return(
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent justify="end">
                {isLogin?
                    (<NavbarItem>
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    size="base"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                            </DropdownTrigger>

                            <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={(key) => onclick(key)}>
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">zoey@example.com</p>
                                </DropdownItem>
                                <DropdownItem key="mypage">マイページ</DropdownItem>
                                <DropdownItem key="notification">通知</DropdownItem>
                                <DropdownItem key="logout" color="danger">
                                    LogOut
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>) :

                    (<NavbarItem>
                        <Button as={Link} color="primary" href="/api/auth/signin" variant="flat">
                            Login
                        </Button>
                    </NavbarItem>)
                }
            </NavbarContent>
        </Navbar>
    );
}
