import express from "express";
import { getAdminDashboard } from "../../controllers/admin/dashboard.js";
import { isAdmin, isAuthenticated } from "../../middlewares/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", isAuthenticated, isAdmin, getAdminDashboard);

export default dashboardRouter;
