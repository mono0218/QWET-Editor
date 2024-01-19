import S3 from "../r2"
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
export class MotionStorage{
    async create({id,buffer}:{id:string,buffer:Buffer}){
        await S3.send(
            new PutObjectCommand({
                Body: buffer,
                Bucket: 'weblive-dev',
                Key: `motion/${id}/${id}.glb`,
                ContentType: "model/gltf-binary",
            })
        )
    }

    async update({id,buffer}:{id:string,buffer:Buffer}){
        await S3.send(
            new PutObjectCommand({
                Body: buffer,
                Bucket: 'weblive-dev',
                Key: `motion/${id}/${id}.glb`,
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
