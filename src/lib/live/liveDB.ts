import prisma from "@/lib/prisma";
import {Session} from "next-auth";

export type LiveDB = {
    uuid:string;
    name:string;
    content:string;
    imageUrl:string;
    fileUrl:string;

    movieUrl:string;
    avatarId:string;
    motionUUID:string;
    stageUUID:string

    license:string;
    userId:number;
}

export class liveDB{

    async Get({uuid}:{uuid:string}){
        return prisma.live.findUnique({
            where:{
                uuid: uuid
            },
            include:{
                user:true,
                motion:true,
                stage:true
            }
        })
    }

    async CountGet({pieces}:{pieces:number}){
        return prisma.live.findMany({
            take:pieces
        })
    }

    async Create(data:LiveDB){
        await prisma.live.create({
            data: {
                uuid:data.uuid,
                name:data.name,
                content:data.content,
                imageUrl:data.imageUrl,
                fileUrl:data.fileUrl,

                movieUrl:data.movieUrl,
                avatarId:data.avatarId,
                motionUUID:data.motionUUID,
                stageUUID:data.stageUUID,

                license:data.license,
                authorId:data.userId
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
