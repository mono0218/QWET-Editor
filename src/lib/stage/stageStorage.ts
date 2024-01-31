import S3 from "@/lib/r2";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class StageStorage {
  async get({ uuid }: { uuid: string }) {
    const url = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: "weblive-dev",
        Key: `stage/${uuid}/${uuid}.glb`,
      }),
      { expiresIn: 60 * 60 },
    );
    return url;
  }

  async create({ uuid, buffer }: { uuid: string; buffer: Buffer }) {
    await S3.send(
      new PutObjectCommand({
        Body: buffer,
        Bucket: "weblive-dev",
        Key: `stage/${uuid}/${uuid}.glb`,
        ContentType: "model/gltf-binary",
      }),
    );
  }

  async update({ uuid, buffer }: { uuid: string; buffer: Buffer }) {
    await S3.send(
      new PutObjectCommand({
        Body: buffer,
        Bucket: "weblive-dev",
        Key: `stage/${uuid}/${uuid}.glb`,
        ContentType: "model/gltf-binary",
      }),
    );
  }

  async remove({ url }: { url: string }) {
    await S3.send(
      new DeleteObjectCommand({
        Bucket: "weblive-dev",
        Key: url,
      }),
    );
  }
}
