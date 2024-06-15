import express from "express";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import newsRouter from "./news.js";
import { isAdmin } from "../../middlewares/auth.js";
import memberRouter from "./member.js";
import withdrawalRouter from "./withdrawals.js";
import shopRouter from "./shop.js";
import productDeliveryRouter from "./product-delivery.js";
import testmonyRouter from "./testimony.js";
import messagesRouter from "./messages.js";

const adminRouter = express.Router();

adminRouter.use("", authRouter);
adminRouter.use("/dashboard", isAdmin, dashboardRouter);
adminRouter.use("/news", isAdmin, newsRouter);
adminRouter.use("/shop", isAdmin, shopRouter);
adminRouter.use("/messages", isAdmin, messagesRouter);
adminRouter.use("/testimony", isAdmin, testmonyRouter);
adminRouter.use("/product-delivery", isAdmin, productDeliveryRouter);
adminRouter.use("/members", isAdmin, memberRouter);
adminRouter.use("/withdrawals", isAdmin, withdrawalRouter);

export default adminRouter;
