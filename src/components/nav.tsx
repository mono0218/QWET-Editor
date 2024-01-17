"use client"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {getServerSession} from "next-auth/next";
import {options} from "../../auth.config";
import {getSession} from "next-auth/react";
import {useState} from "react";

export function Nav(){
    const session =  getSession().then((data)=>{
        if(data != null){
            setLogin(true)
        }
    })

    const [isLogin,setLogin] = useState(false)

    return(
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent justify="end">
                {isLogin?
                    (<NavbarItem>
                        <Button as={Link} color="danger" href="/api/auth/signout" variant="flat">
                            Logout
                        </Button>
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
