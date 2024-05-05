import express from "express";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import newsRouter from "./news.js";
import { isAdmin } from "../../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.use("", authRouter);
adminRouter.use("/dashboard", isAdmin, dashboardRouter);
adminRouter.use("/news", isAdmin, newsRouter);

export default adminRouter;
