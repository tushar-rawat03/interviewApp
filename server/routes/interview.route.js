import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import { upload } from "../Middlewares/multer.js";
import { analyzeResume } from "../Controllers/interview.Controller.js";

const interviewRouter = express.Router();
interviewRouter.post("/resume", isAuth,upload.single("resume"),analyzeResume)

export default interviewRouter;
