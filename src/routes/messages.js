import express from "express";
import { getMessagesPage } from "../controllers/messages.js";

const messagesRouter = express.Router();

messagesRouter.get("", getMessagesPage);

export default messagesRouter;
