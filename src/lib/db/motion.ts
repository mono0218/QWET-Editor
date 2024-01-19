import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export class motionDB{
    userId: number;

    constructor(session:Session) {
        this.userId = Number(session.user.id)
    }

    async Get({id}:{id:string}){
        return prisma.motion.findUnique({
            where:{
                id: Number(id)
            },
        })
    }

    async Create({name,content,url,license}:{name:string,content:string,url:string,license?:string}){
        await prisma.motion.create({
            data: {
                name:name,
                content:content,
                url:url,
                userId:this.userId,
                license:license
            },
        })
    }

    async Update({id,name,content,url,license}:{id:string,name?:string,content?:string,url?:string,license?:string}){
        await prisma.motion.update({
            where:{
                id: Number(id),
                userId: this.userId
            },
            data:{
                name: name,
                content: content,
                url:url,
                license:license
            }
        })
    }

    async Remove({id}:{id:string}) {
        //TODO remove at R2
        await prisma.motion.delete({
            where:{
                id: Number(id),
                userId:this.userId,
            },
        })
    }
}
