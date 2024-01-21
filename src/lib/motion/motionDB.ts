import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export type MotionDB = {
    uuid:string;
    name:string;
    content:string;
    imageUrl:string;
    fileUrl:string;
    license:string;
    userId:number;
}


export class motionDB{

    async Get({uuid}:{uuid:string}){
        return prisma.motion.findUnique({
            where:{
                uuid: uuid
            },

        })
    }

    async CountGet({pieces}:{pieces:number}){
        return prisma.motion.findMany({
            take:pieces
        })
    }

    async Create(data:MotionDB){
        await prisma.motion.create({
            data: {
                uuid:data.uuid,
                name:data.name,
                content:data.content,
                imageUrl:data.imageUrl,
                fileUrl:data.fileUrl,
                license:data.license,
                userId:data.userId
            },
        })
    }

    async Remove({uuid,userId}:{uuid:string,userId:number}) {
        await prisma.motion.delete({
            where:{
                uuid: uuid,
                userId:userId,
            },
        })
    }
}
