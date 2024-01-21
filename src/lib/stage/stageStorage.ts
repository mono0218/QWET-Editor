import S3 from "@/lib/r2";
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";

export class StageStorage{
    async create({uuid,buffer}:{uuid:string,buffer:Buffer}){
        await S3.send(
            new PutObjectCommand({
                Body: buffer,
                Bucket: 'weblive-dev',
                Key: `stage/${uuid}/main.glb`,
                ContentType: "model/gltf-binary",
            })
        )
    }

    async update({uuid,buffer}:{uuid:string,buffer:Buffer}){
        await S3.send(
            new PutObjectCommand({
                Body: buffer,
                Bucket: 'weblive-dev',
                Key: `stage/${uuid}/main.glb`,
                ContentType: "model/gltf-binary",
            })
        )
    }

    async remove({url}:{url:string}){
        await S3.send(
            new DeleteObjectCommand({
                Bucket: 'weblive-dev',
                Key: url,
            })
        )
    }
}
