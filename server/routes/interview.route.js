import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import { upload } from "../Middlewares/multer.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  getInterviewReport,
  getMyInterview,
  submitAnswer,
} from "../Controllers/interview.controller.js";
const interviewRouter = express.Router();
interviewRouter.post("/resume", isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-question", isAuth,generateQuestion)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)
interviewRouter.get("/get-interview",isAuth,getMyInterview)
interviewRouter.get("/report/:id",isAuth,getInterviewReport)

export default interviewRouter;
