"use client"

import {
    Button,
    Dropdown, DropdownItem, DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/react";
import {User} from "@nextui-org/user";
import React from "react";
import {redirect, useRouter} from "next/navigation";
import {router} from "next/client";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "../../database.types";

export function Guest(){
    return (
        <Navbar className={"w-screen"}>
            <NavbarBrand>
                <Link className="font-bold text-inherit" href={"/"}>WEB-LIVE</Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" aria-current="page">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="/auth/login">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="/auth/signup" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export function Login(){
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <Navbar className={"w-screen"}>
            <NavbarBrand>
                <Link className="font-bold text-inherit" href={"/"}>WEB-LIVE</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                            <User
                                as="button"
                                avatarProps={{
                                    isBordered: true,
                                    src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                                }}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-bold">Signed in as</p>
                                <p className="font-bold">@tonyreichert</p>
                            </DropdownItem>
                            <DropdownItem key="mmd">
                                作品一覧
                            </DropdownItem>
                            <DropdownItem key="stage">
                                ステージ一覧
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

