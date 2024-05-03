import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  changeUserPassword,
  getUserProfile,
  updateUserProfile,
} from "../services/profileServices.js";

const getProfile = asyncWrapper(async (req, res) => {
  let data = {
    user: null,
  };

  data.user = await getUserProfile(req.user.id);
  return res.render("member/profile/user-profile", {
    title: data.user.username,
    data,
  });
});

const updateProfile = asyncWrapper(async (req, res) => {
  await updateUserProfile(req.user.id, req.body);
  return res.redirect("/profile");
});

const changePassword = asyncWrapper(async (req, res) => {
  const { oldPassword, password } = req.body;
  await changeUserPassword(req.user.id, oldPassword, password);
});

export { getProfile, updateProfile, changePassword };
