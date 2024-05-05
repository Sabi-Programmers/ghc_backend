import express from "express";
import { getAdminDashboard } from "../../controllers/admin/dashboard.js";

const dashboardRouter = express.Router();

dashboardRouter.get("", getAdminDashboard);

export default dashboardRouter;
