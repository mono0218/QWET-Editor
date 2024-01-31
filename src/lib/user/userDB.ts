import prisma from "@/lib/prisma";

export type UserDB = {
    id:number;
    name:string;
    url:string;
}

export class userDB{
    async Get({id}:{id:number}){
        return prisma.user.findUnique({
            where: {
                id:id
            },
        })
    }

    async upsert(data:UserDB){
        return prisma.user.upsert({
            where: {
                id: data.id
            },
            create: {
                id: data.id,
                name:data.name,
                iconUrl:data.url,
            },
            update: {
                id: data.id,
                name:data.name,
                iconUrl:data.url,
            },
        })
    }

    async Update({id,content}:{id:number,content:string}){
        return prisma.user.update({
            where:{
                id: id
            },
            data:{
                content:content
            }
        })
    }
}
