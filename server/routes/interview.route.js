import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import { upload } from "../Middlewares/multer.js";
import { analyzeResume, finishInterview, generateQuestion, submitAnswer } from "../Controllers/interview.Controller.js";

const interviewRouter = express.Router();
interviewRouter.post("/resume", isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-question", isAuth,generateQuestion)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)

export default interviewRouter;
