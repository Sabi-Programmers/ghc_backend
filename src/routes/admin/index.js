import express from "express";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import newsRouter from "./news.js";
import { isAdmin } from "../../middlewares/auth.js";
import memberRouter from "./member.js";

const adminRouter = express.Router();

adminRouter.use("", authRouter);
adminRouter.use("/dashboard", isAdmin, dashboardRouter);
adminRouter.use("/news", isAdmin, newsRouter);
adminRouter.use("/members", isAdmin, memberRouter);

export default adminRouter;
