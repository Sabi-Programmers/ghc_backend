import express from "express";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import newsRouter from "./news.js";
const adminRouter = express.Router();

adminRouter.use("", authRouter);
adminRouter.use("/dashboard", dashboardRouter);
adminRouter.use("/news", newsRouter);

export default adminRouter;
