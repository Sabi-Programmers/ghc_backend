import express from "express";
import {
  createUser,
  getRegisterPage,
  getLoginPage,
  loginUser,
  logoutUser,
  getForgotPasswordPage,
  getResetPasswordPage,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import {
  validateAuth,
  validateCreateUserAuth,
  validateLoginAuth,
  validateResetPassword,
} from "../validators/authValidators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import countryNames from "../utils/countriesData.js";

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
authRouter.get("/forgot-password", getForgotPasswordPage);
authRouter.post("/forgot-password", forgotPassword);
authRouter.get("/reset-password", getResetPasswordPage);
authRouter.post(
  "/reset-password",
  validateResetPassword,
  validateAuth,
  resetPassword
);
authRouter.post("/logout", logoutUser);

export default authRouter;
