"use strict";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
const router = express.Router();
/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = async (req: Request, res: Response) => {
  return res.status(200).json({ testData: "Hi" });
};

/* GET home page. */
router.get("/test", async (req: Request, res: Response, next: NextFunction) => {
  // return res.status(200).json({ testData: "Hi" });
  // to  make use of redirect like this
  // use form post instead of ajax/xhr on react
  return res.redirect("/");
});

module.exports = router;
