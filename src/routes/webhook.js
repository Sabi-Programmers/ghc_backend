import express from "express";
import { getTransactionNotification } from "../controllers/webhook.js";

const webhookRouter = express.Router();

webhookRouter.post("/", getTransactionNotification);

export default webhookRouter;
