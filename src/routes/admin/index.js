import express from "express";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
const adminRouter = express.Router();

adminRouter.use("", authRouter);
adminRouter.use("", dashboardRouter);

export default adminRouter;
