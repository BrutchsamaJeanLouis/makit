import express, { Request, Response } from "express";
import { ensureAuthentication } from "../middlewareFunctions/auth-middleware";
import { validate } from "express-yup";
import { createPostRequestSchema } from "../../utils/validation-schemas/schema-create-post";
import Project from "../../database/models/project";
import Rating from "../../database/models/rating";
import User from "../../database/models/user";
import Media from "../../database/models/media";
import Comment from "../../database/models/comment";
import Location from "../../database/models/location";
import Fund from "../../database/models/fund";
import ProjectTenant from "../../database/models/project_tenant";
import { ProjectVisibility } from "../../utils/enums";
import canUserViewProject from "../../utils/validation-schemas/canUserViewProject";
import { Op, where } from "sequelize";
const router = express.Router();

router.post("/create", ensureAuthentication, validate(createPostRequestSchema), async (req: Request, res: Response) => {
  const { title, description, visibility, phase, tags } = req.body;
  // TODO link hashTags
  try {
    const newProject = await Project.create({
      title: title,
      description: description,
      userId: req.session.user?.id,
      visibility: visibility,
      phase: phase
    });
    return res.json({ newProject: newProject, result: "Success" });
  } catch (err: any) {
    const message = err?.message || err?.name || "Internal server error";
    return res.status(500).json({ message: message, error: err });
  }
});

router.get("/projects", async (req: Request, res: Response) => {
  const user = req.session.user;
  // TODO: validation page grater than 0 (no negative numbers)
  const page = Number(req.query.page || "0");
  const resultsPerPage = Number(req.query.resultsPerPage || "20");
  try {
    if (user) {
      let projects = await Project.findAndCountAll({
        offset: page === 0 ? 0 : page * resultsPerPage,
        limit: resultsPerPage,
        subQuery: false,
        where: {
          [Op.or]: {
            visibility: "public",
            // for some reason this does not include the other data for who else is invited
            // this is good

            // if visibility is private, check if im invited to it before including in query
            [Op.and]: { visibility: "private", "$ProjectTenants.userId$": user.id }
          }
        },
        include: [
          { model: User },
          { model: Rating },
          { model: Comment },
          { model: Location },
          { model: Media },
          { model: ProjectTenant }
        ],
        order: [["createdAt", "DESC"]]
      });
      return res.status(200).json({ projects: projects.rows, totalResults: projects.count });
    } else {
      // only find public projects
      let projects = await Project.findAndCountAll({
        offset: page === 0 ? 0 : page * resultsPerPage,
        limit: resultsPerPage,
        subQuery: false,
        where: {
          visibility: ProjectVisibility.PUBLIC
        },
        include: [{ model: User }, { model: Rating }, { model: Comment }, { model: Location }, { model: Media }],
        order: [["createdAt", "DESC"]]
      });
      return res.status(200).json({ projects: projects.rows, totalResults: projects.count });
    }
  } catch (err: any) {
    const message = err?.message || err?.name || "Internal server error";
    return res.status(500).json({ message: message, error: err });
  }
});

// TODO Validate
router.get("/:projectId", ensureAuthentication, async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);

  try {
    let project = await Project.findByPk(projectId, {
      include: [
        { model: User },
        { model: Rating },
        { model: Comment },
        { model: Location },
        { model: Media }
        // { model: Fund },
        // { model: ProjectTenant, include: [{ model: User }] }
      ]
    });
    if (!project) return res.status(404).json({ message: "Project Not Found" });

    const allowedToView = canUserViewProject(project, req.session);

    if (allowedToView) {
      return res.status(200).json({ project: project });
    } else {
      return res.status(401).json({ message: "You do not have access to view this" });
    }
  } catch (err: any) {
    const message = err?.message || err?.name || "Internal server error";
    return res.status(500).json({ message: message, error: err });
  }
});

export default router;
