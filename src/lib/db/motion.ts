import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export class motionDB{
    userId: number;

    constructor(session:Session) {
        this.userId = Number(session.user.id)
    }

    async create({name,content,url,license}:{id:number,name:string,content:string,url:string,license?:string}){
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

    async update({id,name,content,url,license}:{id:number,name?:string,content?:string,url?:string,license?:string}){
        await prisma.motion.update({
            where:{
                id: id,
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

    async remove({id}:{id:number}) {
        //TODO remove at R2
        await prisma.motion.delete({
            where:{
                id: id,
                userId:this.userId,
            },
        })
    }
}
