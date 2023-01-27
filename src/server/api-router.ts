import express from "express";
import authRouter from "./routes/auth";
import projectRouter from "./routes/project";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/project", projectRouter);

export default router;
