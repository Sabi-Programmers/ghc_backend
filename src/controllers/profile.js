import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { getUserProfile } from "../services/profileServices.js";

const getProfile = asyncWrapper(async (req, res, next) => {
  let data = {
    user: null,
  };

  data.user = await getUserProfile();
  return res.render("member/profile/user-profile", {
    title: data.user.username,
    data,
  });
});

export { getProfile };
