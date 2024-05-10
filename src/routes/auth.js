import express from "express";
import {
  createUser,
  getRegisterPage,
  getLoginPage,
  loginUser,
  logoutUser,
} from "../controllers/auth.js";
import {
  validateAuth,
  validateCreateUserAuth,
  validateLoginAuth,
} from "../validators/authValidators.js";
import { isAuthenticated } from "../middlewares/auth.js";
const authRouter = express.Router();

authRouter.get("/register", isAuthenticated, getRegisterPage);
authRouter.post(
  "/register",
  isAuthenticated,
  validateCreateUserAuth,
  validateAuth,
  createUser
);
authRouter.get("/login", isAuthenticated, getLoginPage);
authRouter.post(
  "/login",
  isAuthenticated,
  validateLoginAuth,
  validateAuth,
  loginUser
);
authRouter.post("/logout", logoutUser);

export default authRouter;
