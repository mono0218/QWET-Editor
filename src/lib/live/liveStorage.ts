import S3 from "../r2"
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
export class LiveStorage{
    async create({uuid,buffer}:{uuid:string,buffer:Buffer}){
        await S3.send(
            new PutObjectCommand({
                Body: buffer,
                Bucket: 'weblive-dev',
                Key: `live/${uuid}/${uuid}.json`,
                ContentType: "application/json",
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
