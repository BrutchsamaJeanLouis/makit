import express, { Request, Response } from "express";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";

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
router.post("/attach", async (req: Request, res: Response) => {
  const { projectId = 1, files } = req.body;
  const successUploadResult = [];
  const location = path.resolve(__dirname, "./image.png");
  const fileBuffer = fs.readFileSync(location);

  await s3Bucket.putObject(
    {
      Bucket: String(process.env.AWS_S3_BUCKET_NAME),
      Key: `1/private.png`,
      Body: fileBuffer,
      ACL: "bucket-owner-full-control"
    },
    (err, data) => {
      console.log("s3Upload from Node", data, err);
    }
  );

  if (files) {
    files.forEach(f => {
      //@ts-ignore
      successUploadResult.push({
        location: "https://i.imgur.com/QwgGYdm.jpeg",
        key: `/${req.session.user!.id}/${projectId}/me.png`
      });
    });
  }
  return res.status(200).json({
    successUploadResult
  });
});

/*==================================================================**
 |
 |              POST          /media/get
 |
 *===================================================================*/
router.post("/get", async (req: Request, res: Response) => {
  const { s3Key } = req.body;
  router.get("/:userId/:itemId/:imageFileName", async (req, res) => {
    // todo change to srurl(Localhost:498) and key
    const img = path.resolve(`./local-uploads/${req.params.userId}/${req.params.itemId}/${req.params.imageFileName}`);
    try {
      if (fs.existsSync(img)) {
        console.log("requested local file exists");
        fs.createReadStream(img).pipe(res);
      } else {
        return res.status(404).send();
      }
    } catch (err) {
      return res.status(500).send();
    }

    return res.type("image").send();
  });
});

export default router;
