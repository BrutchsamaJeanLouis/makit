import Project from "../../database/models/project";
import { SessionData } from "express-session";

export function canUserViewProject(project: Project, serverSession: Partial<SessionData>): boolean {
  let result = false;

  switch (project.visibility) {
    case "public": {
      result = true;
      break;
    }
    case "private": {
      //            if user is invited                         or           he is the owner
      if (serverSession.user?.projectsAllowed.includes(project.id) || project.userId === serverSession.user?.id) {
        result = true;
      }
      break;
    }
    case "hidden": {
      if (project.userId === serverSession.user?.id) {
        result = true;
      }
      break;
    }
    default: {
      // do nothing
      break;
    }
  }

  return result;
}

export function canUserViewMedia(visibility, projectId, userId, serverSession: Partial<SessionData>): boolean {
  let result = false;

  switch (visibility) {
    case "public": {
      result = true;
      break;
    }
    case "private": {
      //            if user is invited                         or           he is the owner
      if (serverSession.user?.projectsAllowed.includes(projectId) || userId === serverSession.user?.id) {
        result = true;
      }
      break;
    }
    case "hidden": {
      if (userId === serverSession.user?.id) {
        result = true;
      }
      break;
    }
    default: {
      // do nothing
      break;
    }
  }

  return result;
}
