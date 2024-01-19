import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export class stageDB{
    userId: number;

    constructor(session:Session) {
        this.userId = Number(session.user.id)
    }

    async Get({id}:{id:string}){
        return prisma.stage.findUnique({
            where:{
                id: Number(id)
            },
            include: {
                user: true
            }
        })
    }

    async Create({name,content,url,license}:{name:string,content:string,url:string,license?:string}){
        console.log(this.userId)
        await prisma.stage.create({
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
        await prisma.stage.update({
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
        await prisma.stage.delete({
            where:{
                id: Number(id),
                userId:this.userId,
            },
        })
    }
}
