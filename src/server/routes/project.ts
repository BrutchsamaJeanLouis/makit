import express, { Request, Response } from "express";
import { ensureAuthentication } from "../middlewareFunctions/auth-middleware";
import { validate } from "express-yup";
import { createPostRequestSchema } from "../../utils/validation-schemas/schema-create-post";
import Project from "../../database/models/project";
const router = express.Router();

router.post("/create", ensureAuthentication, validate(createPostRequestSchema), async (req: Request, res: Response) => {
  const { title, description } = req.body;
  try {
    const newProject = await Project.create({
      title: title,
      description: description,
      userId: req.session.user?.id
    });
    console.log(newProject);
    return res.json({ newProject: newProject });
  } catch (err) {
    return res.status(500).json({ message: "ServerErr", error: err });
  }
});

export default router;
