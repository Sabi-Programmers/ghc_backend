import express from "express";
import {
  getAddMessagePage,
  sendMessage,
} from "../../controllers/admin/messages.js";

const messagesRouter = express.Router();

messagesRouter.get("/send", getAddMessagePage);
messagesRouter.post("/send", sendMessage);

export default messagesRouter;
