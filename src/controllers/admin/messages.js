import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import userServices from "../../services/userServices.js";
import response from "../../utils/response.js";
import { createMessage } from "../../services/messageServices.js";

const getAddMessagePage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    member: null,
  };

  const member = req.query.member;

  if (member) {
    data.member = await userServices.getSingleUser(member);
  }

  res.render("admin/messages/add-message", {
    title: "Send Message",
    data,
  });
});

const sendMessage = asyncWrapper(async (req, res) => {
  const { title, narration, userId } = req.body;
  if (!title || !narration || !userId) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "UserId, Title or Narration is required"
    );
  }

  await createMessage(title, narration, "ADMIN", userId);
  return response.json(res, StatusCodes.CREATED, true, "Message Sent");
});

export { getAddMessagePage, sendMessage };
