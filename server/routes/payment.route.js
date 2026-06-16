import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import {
  createOrder,
  verifyPayment,
} from "../Controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/order", isAuth, createOrder);
paymentRouter.post("/verify", isAuth, verifyPayment);

export default paymentRouter;
