import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getProfile } from "../controllers/profile.js";

const profileRouter = express.Router();

profileRouter.get("/", isAuthenticated, getProfile);

export default profileRouter;
