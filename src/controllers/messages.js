import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import response from "../utils/response.js";
import {
  createMessage,
  getSingleMessage,
  getUserMessages,
} from "../services/messageServices.js";
import { calculatePagination } from "../utils/index.js";

const getMessagesPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.limit) || 10;

  const { messages, totalItems } = await getUserMessages(
    req.user.id,
    page,
    perPage
  );
  data.messages = messages;
  data.pagination = calculatePagination(totalItems, page, perPage);

  return res.render("member/messages/messages", {
    title: "Messages",
    data,
  });
});
const getAMessagePage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  data.message = await getSingleMessage(
    req.user.id,
    req.params.id,
    req.user.role
  );

  return res.render("member/messages/single-message", {
    title: data.message.title,
    data,
  });
});
const getAddMessagePage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  return res.render("member/messages/add-message", {
    title: "Send Message",
    data,
  });
});
const addMessage = asyncWrapper(async (req, res) => {
  const { title, narration } = req.body;
  if (!title || !narration) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Title or Narration is required"
    );
  }

  await createMessage(title, narration, "USER", req.user.id);

  return response.json(res, StatusCodes.CREATED, true, "Message Sent");
});

export { getMessagesPage, getAMessagePage, getAddMessagePage, addMessage };
