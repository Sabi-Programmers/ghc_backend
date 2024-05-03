import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/profile.js";

const profileRouter = express.Router();

profileRouter.get("/", isAuthenticated, getProfile);
profileRouter.post("/", isAuthenticated, updateProfile);

export default profileRouter;
