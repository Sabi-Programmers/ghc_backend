import express from "express";
import { getDashbord, getSuccessPage } from "../controllers/dashboard.js";
const dashboardRouter = express.Router();

dashboardRouter.get("", getDashbord);
dashboardRouter.get("/success", getSuccessPage);

export default dashboardRouter;
