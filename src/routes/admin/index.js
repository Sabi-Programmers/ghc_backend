import express from "express";
import authRouter from "./auth.js";
const adminRouter = express.Router();

adminRouter.use("", authRouter);

export default adminRouter;
