import express from "express";
import { getTransactionNotifcation } from "../controllers/webhook.js";

const webhookRouter = express.Router();

webhookRouter.post("/", getTransactionNotifcation);

export default webhookRouter;
