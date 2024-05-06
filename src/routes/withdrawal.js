import express from "express";
import { getWithdrawalPage } from "../controllers/withdrawal.js";
const withdrawalRouter = express.Router();

withdrawalRouter.get("/", getWithdrawalPage);

export default withdrawalRouter;
