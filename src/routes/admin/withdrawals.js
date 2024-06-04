import express from "express";
import { getWithdrawalRequestPage } from "../../controllers/admin/withdrawal.js";

const withdrawalRouter = express.Router();

withdrawalRouter.get("", getWithdrawalRequestPage);

export default withdrawalRouter;
