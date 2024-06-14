import asyncWrapper from "../middlewares/asyncWrapper.js";

const getMessagesPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  return res.render("member/messages", {
    title: "Messages",
    data,
  });
});

export { getMessagesPage };
