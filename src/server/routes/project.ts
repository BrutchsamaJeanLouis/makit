import express, { Request, Response } from "express";
import { ensureAuthentication } from "../middlewareFunctions/auth-middleware";
import { validate } from "express-yup";
import { createPostRequestSchema } from "../../utils/validation-schemas/schema-create-post";
import Project from "../../database/models/project";
import ProjectLikeDislike from "../../database/models/project_like_dislike";
import User from "../../database/models/user";
import Media from "../../database/models/media";
import Comment from "../../database/models/comment";
import Location from "../../database/models/location";
import Fund from "../../database/models/fund";
import ProjectTenant from "../../database/models/project_tenant";
import { ProjectVisibility } from "../../utils/enums";
import { canUserViewProject } from "../../utils/validation-schemas/canUserView";
import { Op } from "sequelize";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import htmlSanitizeConfig from "../../utils/htmlSanitizeConfig";
import HashTag from "../../database/models/hashtag";
import ProjectHashTag from "../../database/models/project_hashtag";
import Poll from "../../database/models/poll";
import PollChoice from "../../database/models/poll_choice";
import PollVote from "../../database/models/poll_vote";
import { PollType } from "../../../types/data-types";
import ProjectView from "../../database/models/project_view";
const router = express.Router();

/*==================================================================**
 |
 |              POST          /project/create
 |
 *===================================================================*/
export const createNewProject = async (req: Request, res: Response) => {
  const { title, visibility, phase } = req.body;
  const tags: string[] = req.body.tags;
  const polls: PollType[] = req.body.polls;
  const dangerousDescription = req.body.description;

  const purifyer = DOMPurify(new JSDOM("").window);
  const description = purifyer.sanitize(dangerousDescription, htmlSanitizeConfig);

  // TODO link hashTags
  try {
    const newProject = await Project.create({
      title: title,
      description: description,
      userId: req.session.user?.id,
      visibility: visibility,
      phase: phase
    });

    // loop though polls array and add them to polls table
    for (let i = 0; i < polls.length; i++) {
      const currentPoll = polls[i];

      const poll = await Poll.create({
        question: currentPoll.question,
        projectId: newProject.id
      });

      // loop through choices and create choice record for each
      for (let i = 0; i < currentPoll.choices.length; i++) {
        const currentChoice = currentPoll.choices[i];

        await PollChoice.create({
          option: currentChoice,
          pollId: poll.id
        });
      }
    }

    // Loop through tags array and add them to tags table
    for (let i = 0; i < tags.length; i++) {
      const currentTag = tags[i];

      // create or find hashtag
      const databaseHashTag = await HashTag.findOrCreate({
        where: { name: currentTag },
        defaults: { name: currentTag } // create value if no record was found
      });
      // Link hashTag to project
      await ProjectHashTag.create({
        hashtagId: databaseHashTag[0].id,
        projectId: newProject.id
      });
    }

    // Update variable with changes to the db (hashtag creation an linking)
    await newProject.reload({
      include: [{ model: ProjectHashTag, include: [HashTag] }]
    });

    return res.json({ newProject: newProject, result: "Success" });
  } catch (err: any) {
    const message = err?.message || err?.name || "Internal server error";
    return res.status(500).json({ message: message, error: err });
  }
};

/*==================================================================**
 |
 |              GET          /project/projects
 |
 *===================================================================*/
export const getRecentProjects = async (req: Request, res: Response) => {
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
          { model: ProjectLikeDislike },
          { model: Comment },
          { model: Location },
          { model: Media },
          { model: ProjectTenant },
          { model: HashTag }
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
        include: [
          { model: User },
          { model: ProjectLikeDislike },
          { model: Comment },
          { model: Location },
          { model: Media }
        ],
        order: [["createdAt", "DESC"]]
      });
      return res.status(200).json({ projects: projects.rows, totalResults: projects.count });
    }
  } catch (err: any) {
    const message = err?.message || err?.name || "Internal server error";
    return res.status(500).json({ message: message, error: err });
  }
};

/*==================================================================**
 |
 |              GET          /project/:projectid
 |
 *===================================================================*/
// TODO Validate
export const getProjectById = async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);

  try {
    let project = await Project.findByPk(projectId, {
      include: [
        { model: User },
        { model: ProjectLikeDislike },
        { model: Comment },
        { model: Location },
        { model: Media },
        { model: ProjectHashTag, include: [HashTag] },
        { model: Poll, include: [{ model: PollChoice, include: [PollVote] }] }
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
};

/*==================================================================**
 |
 |              PUT          /project/:projectId
 |
 *===================================================================*/
export const updateProjectDescriptionById = async (req: Request, res: Response) => {
  // TODO ensure user owns project
  const { projectId } = req.params;
  const { description } = req.body;

  try {
    await Project.update(
      {
        description: description
      },
      { where: { id: projectId } }
    );

    return res.json({ message: "success" });
  } catch (err: any) {
    const message = err?.message || err?.name || "Internal server error";
    return res.status(500).json({ message: message, error: err });
  }
};

// TODO: Rate limiting
export const incrementProjectView = async (req: Request, res: Response) => {
  const visitorId: string = req.body.visitorId;
  const projectId = Number(req.body.projectId);
  const ipAddress = req.ip;

  const found = await ProjectView.findOrCreate({
    defaults: { ipAddress: ipAddress, visitorId: visitorId, projectId: projectId },
    where: {
      ipAddress: ipAddress,
      visitorId: visitorId
    }
  });
};

export default router;
