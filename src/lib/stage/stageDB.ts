import prisma from "@/lib/prisma";

export type StageDB = {
    uuid:string;
    name:string;
    content:string;
    imageUrl:string;
    fileUrl:string;
    license:string;
    userId:number;
}

export class stageDB{
    async Get({uuid}:{uuid:string}){
        return prisma.stage.findUnique({
            where: {
                uuid: uuid
            },
            include: {
                user: true
            }
        })
    }

    async CountGet({pieces}:{pieces:number}){
        return prisma.stage.findMany({
            take:pieces
        })
    }

    async Create(data:StageDB){
        return prisma.stage.create({
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
        return prisma.stage.delete({
            where:{
                uuid: uuid,
                userId:userId,
            },
        })
    }
}
