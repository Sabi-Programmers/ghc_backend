import express from "express";
import {
  changePassword,
  getAccountSettings,
  getProfile,
  updateProfile,
} from "../controllers/profile.js";

const profileRouter = express.Router();

profileRouter.get("/", getProfile);
profileRouter.post("/", updateProfile);
profileRouter.get("/account-settings", getAccountSettings);
profileRouter.post("/change-password", changePassword);

export default profileRouter;
