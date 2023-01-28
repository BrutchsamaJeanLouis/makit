// declare modules here
import express from "express";
declare module "express-session" {
  interface SessionData {
    user:
      | {
          id: number;
          email: string;
          username: string;
          projectsAllowed: number[];
        }
      | undefined
      | null;
    returnTo: string;
  }
}

function controller(req: express.Request, res: express.Response) {
  req.session.user;
  req.session.returnTo;
}
