import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getDashbord, getSuccessPage } from "../controllers/dashboard.js";
const dashboardRouter = express.Router();

dashboardRouter.get("", isAuthenticated, getDashbord);
dashboardRouter.get("/success", isAuthenticated, getSuccessPage);

export default dashboardRouter;
