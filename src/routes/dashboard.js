import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getDashbord } from "../controllers/dashboard.js";
const dashboardRouter = express.Router();

dashboardRouter.get("", isAuthenticated, getDashbord);

export default dashboardRouter;
