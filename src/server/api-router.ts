import express, { NextFunction, Request, Response } from "express";
import { validate } from "express-yup";
import {
  confirmUserAccountFromEmailToken,
  getUserCredentials,
  loginUser,
  logoutUser,
  refreshUserPermission,
  registerUser,
  resendVerificationToUserEmail
} from "./routes/auth";
import { createNewProject, getProjectById, getRecentProjects, updateProjectDescriptionById } from "./routes/project";
import { attachMediaToProject, getMediaFromS3Bucket } from "./routes/media";
import { ensureAuthentication, ensureLogout } from "./middlewareFunctions/auth-middleware";
import { createPostRequestSchema } from "../utils/validation-schemas/schema-create-post";
import multer from "multer";
const memStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memStorage });
const router = express.Router();

// Logger to console log all api routes called;
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  // "/api/auth/credentials & refresh-perms is called too many times"
  if (req.originalUrl !== "/api/auth/credentials" && req.originalUrl !== "/api/auth/refresh-perms") {
    console.log(req.method, req.originalUrl);
  }
  next();
});

// Auth routes
router.get("/auth/credentials", getUserCredentials);
router.get("/auth/refresh-perms", refreshUserPermission);
router.post("/auth/register", ensureLogout, registerUser);
router.get("/auth/register-confirm/:token", confirmUserAccountFromEmailToken);
router.post("/auth/resend-verification", resendVerificationToUserEmail);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logoutUser);

// Project routes
router.post("/project/create", ensureAuthentication, validate(createPostRequestSchema), createNewProject);
router.get("/project/projects", getRecentProjects);
router.get("/project/:projectId", ensureAuthentication, getProjectById);
router.put("/project/:projectId", ensureAuthentication, updateProjectDescriptionById);

// Media routes
router.post("/media/attach", ensureAuthentication, uploadMemory.any(), attachMediaToProject);
router.get("/media/:userId/:projectId/:filename", getMediaFromS3Bucket);

export default router;
