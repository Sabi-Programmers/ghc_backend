import express from "express";
import { getAdminDashboard } from "../../controllers/admin/dashboard.js";
import { isAdmin, isAuthenticated } from "../../middlewares/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("", isAuthenticated, isAdmin, getAdminDashboard);

export default dashboardRouter;
