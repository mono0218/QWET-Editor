import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export class userDB{
    id: number;
    name: string;

    constructor(session:Session) {
        this.id = Number(session.user.id)
        this.name = session.user.name
    }

    async create(){
        await prisma.user.create({
            data: {
                id:this.id,
                name:this.name
            },
        })
    }

    async nameUpdate(){
        await prisma.user.update({
            where:{
                id:this.id,
            },
            data:{
                name:this.name
            }
        })
    }

    async loginInit(){
        try{
            await this.create()
        }catch(e){
            if(e.code === "P2002"){
                await this.nameUpdate()
            }
        }
    }

    async profileUpdate({content}:{content:string}){
        await prisma.user.update({
            where:{
                id:this.id,
                name:this.name
            },
            data:{
                content
            }
        })
    }
}
