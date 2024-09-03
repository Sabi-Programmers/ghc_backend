import express from "express";
import {
  createAdmin,
  loginAdmin,
  getAdminLoginPage,
  logoutAdmin,
} from "../../controllers/admin/auth.js";
import {
  validateAuth,
  validateLoginAuth,
} from "../../validators/authValidators.js";
import { isAdmin, isAuthenticated } from "../../middlewares/auth.js";

const authRouter = express.Router();

authRouter.get("", isAuthenticated, (req, res) => {
  res.redirect("/admin/login");
});

authRouter.get("/login", isAuthenticated, getAdminLoginPage);

authRouter.post(
  "/login",
  isAuthenticated,
  validateLoginAuth,
  validateAuth,
  loginAdmin
);

authRouter.post("/create-admin", isAdmin, createAdmin);

authRouter.post("/logout", logoutAdmin);

export default authRouter;
