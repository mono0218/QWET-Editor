import S3 from "../r2"
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import Sharp from "sharp"

export class ImageStorage{
    async create({uuid,buffer}:{uuid:string,buffer:Buffer}){

        await S3.send(
            new PutObjectCommand({
                Body: buffer,
                Bucket: 'weblive-dev-image',
                Key: `image/${uuid}/${uuid}.png`,
                ContentType: "image/png",
            })
        )
    }

    async remove({url}:{url:string}){
        await S3.send(
            new DeleteObjectCommand({
                Bucket: 'weblive-dev-image',
                Key: url,
            })
        )
    }

}
