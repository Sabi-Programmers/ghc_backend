import express from "express";
import {
  getOtp,
  getWithdrawalPage,
  makeWithdrawalRequest,
} from "../controllers/withdrawal.js";
const withdrawalRouter = express.Router();

withdrawalRouter.get("/", getWithdrawalPage);
withdrawalRouter.post("/", makeWithdrawalRequest);
withdrawalRouter.post("/otp", getOtp);

export default withdrawalRouter;
