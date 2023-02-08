import express, { NextFunction, Request, Response } from "express";
import authRouter from "./routes/auth";
import projectRouter from "./routes/project";
const router = express.Router();

// Logger to console log all api routes called;
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  // "/api/auth/credentials & refresh-perms is called too many times"
  if (req.originalUrl !== "/api/auth/credentials" && req.originalUrl !== "/api/auth/refresh-perms") {
    console.log(req.method, req.originalUrl);
  }
  next();
});
router.use("/auth", authRouter);
router.use("/project", projectRouter);

export default router;
