import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  changePassword,
  getAccountSettings,
  getProfile,
  updateProfile,
} from "../controllers/profile.js";

const profileRouter = express.Router();

profileRouter.get("/", isAuthenticated, getProfile);
profileRouter.post("/", isAuthenticated, updateProfile);
profileRouter.get("/account-settings", isAuthenticated, getAccountSettings);
profileRouter.post("/change-password", isAuthenticated, changePassword);

export default profileRouter;
