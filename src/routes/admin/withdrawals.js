import express from "express";
import {
  getWithdrawalHistoryPage,
  getWithdrawalRequestPage,
} from "../../controllers/admin/withdrawal.js";

const withdrawalRouter = express.Router();

withdrawalRouter.get("", getWithdrawalRequestPage);
withdrawalRouter.get("/history", getWithdrawalHistoryPage);

export default withdrawalRouter;
