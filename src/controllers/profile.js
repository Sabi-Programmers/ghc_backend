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

const getAccountSettings = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };
  return res.render("member/profile/account-settings", {
    title: "Account Settings",
    data,
  });
});

const changePassword = asyncWrapper(async (req, res) => {
  const { oldPassword, password } = req.body;
  await changeUserPassword(req.user.id, oldPassword, password);
  return res.redirect("/profile/account-settings");
});

export { getProfile, updateProfile, changePassword, getAccountSettings };
