import express, { Request, Response } from "express";
import AWS, { AWSError } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";
import { Express } from "express";
import Media from "../../database/models/media";
const router = express.Router();

const s3Bucket = new S3({
  s3ForcePathStyle: true,
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
});

/*==================================================================**
 |
 |              POST          /media/attach
 |
 *===================================================================*/
export const attachMediaToProject = async (req: Request, res: Response) => {
  // TODO ensure user owns project
  const { projectId } = req.body;
  const files = req.files ?? [];
  const successUploadResult: any[] = [];
  const userId = req.session.user!.id;

  // @ts-ignore
  const validFiles = Number(files.length) > 0 ? files.filter(f => f && f.size > 2099999).length === 0 : true;

  if (!validFiles) {
    return res.status(400).json({ message: "one or more files exceeded the size limit" });
  }

  for (let i = 0; i < Number(files.length); i++) {
    const currentFile: Express.Multer.File = files[i];
    const filename = `${new Date().getTime()}_${currentFile.originalname}`;
    const s3Key = `${userId}/${projectId}/${filename}`;

    await s3Bucket
      .upload(
        {
          Bucket: String(process.env.AWS_S3_BUCKET_NAME),
          Key: s3Key,
          Body: currentFile.buffer,
          ACL: "bucket-owner-full-control"
        },
        (err, data) => {
          if (data) {
            // successUploadResult.push(data.ETag);
          }
        }
      )
      .on("httpUploadProgress", function (evt) {
        // console.log(evt)
        // Emit Here your events (send this to a socket io id then client can listen in to the socket for upload progress)
        // then destroy the socket when upload is complete
      })
      .promise()
      .then(async (val: S3.ManagedUpload.SendData) => {
        const domain = process.env.BASE_URL;
        const mediaType = currentFile.mimetype.split("/")[0];
        const format = currentFile.mimetype.split("/")[1];
        const mediaURl = `${domain}/api/media/${val.Key}`;

        await Media.create({
          mediaType: mediaType,
          mediaFormat: format,
          s3BucketKey: val.Key,
          mediaUrl: mediaURl,
          projectId: projectId
        });

        successUploadResult.push({
          s3Key: val.Key,
          mediaUrl: val.Location,
          type: mediaType,
          format: format
        });
      });

    // 1 Iteration Done
  }

  return res.status(200).json(successUploadResult);
};

/*==================================================================**
 |
 |              GET          /media/:userId/:projectId/:filename
 |
 *===================================================================*/

export const getMediaFromS3Bucket = async (req: Request, res: Response) => {
  // TODO ensure user can view the image before sending
  const { userId, projectId, filename } = req.params;
  const s3Key = `${userId}/${projectId}/${filename}`;
  try {
    const awsReqParams = { Bucket: String(process.env.AWS_S3_BUCKET_NAME), Key: s3Key };
    const fileStream = s3Bucket.getObject(awsReqParams).createReadStream();

    await fileStream.pipe(res);
  } catch (err) {
    return res.status(500).send();
  }

  // return res.type("image").send();
};

export default router;
