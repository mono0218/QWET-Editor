import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export class userDB{

    async Get({id}:{id:number}){
        return prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

    async Create({id,name,iconUrl}:{id:string,name:string,iconUrl:string}){
        return prisma.user.create({
            data: {
                id: Number(id),
                name: name,
                iconUrl: iconUrl,
            },
        });
    }

    async Update({id,name,iconUrl,content}:{id:string,name:string,iconUrl:string,content:string}){
        return prisma.user.update({
            where:{
                id:Number(id),
            },
            data:{
                name:name,
                iconUrl: iconUrl,
                content:content
            }
        })
    }
}
