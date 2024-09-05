import express from "express";
import {
  changePassword,
  getAccountSettings,
  getAdminDashboard,
} from "../../controllers/admin/dashboard.js";
import {
  validateAuth,
  validateChangePassword,
} from "../../validators/authValidators.js";

const dashboardRouter = express.Router();

dashboardRouter.get("", getAdminDashboard);
dashboardRouter.get("/account-settings", getAccountSettings);
dashboardRouter.post(
  "/account-settings/change-password",
  validateChangePassword,
  validateAuth,
  changePassword
);

export default dashboardRouter;
