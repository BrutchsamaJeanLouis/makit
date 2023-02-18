import express, { Request, Response } from "express";

const router = express.Router();

router.post("/attach", (req: Request, res: Response) => {
  const { projectId, files } = req.body;
  const successUploadResult = [];
  files.forEach(f => {
    //@ts-ignore
    successUploadResult.push({
      location: "https://i.imgur.com/QwgGYdm.jpeg",
      key: `/${req.session.user!.id}/${projectId}/me.png`
    });
  });
  return res.status(200).json({
    successUploadResult
  });
});

export default router;
