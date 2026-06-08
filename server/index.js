import express from "express";
import dotenv from "dotenv";
dotenv.config(); // ✅ move to top before everything else
import connectDb from "./Configs/connectDb.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import interviewRouter from "./routes/interview.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview",interviewRouter)

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
  connectDb();
});
