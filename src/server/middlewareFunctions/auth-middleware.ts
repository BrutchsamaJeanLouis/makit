import { NextFunction, Request, Response } from "express";

export const ensureAuthentication = (req: Request, res: Response, next: NextFunction) => {
  // id user session exists - Carry on
  if (req.session.user?.id) {
    return next();
  }

  // else tell react to redirect to login
  req.session.returnTo = req.headers["currentbrowserpath"] || req.headers["x-currentbrowserpath"]; // req.originalUrl;
  return res
    .status(302)
    .json({ redirect: "/login?error=please login to complete operation", error: "Login to complete operation" });
};
