import express from "express";
import staticPagesRouter from "./staticPagesRoutes.js";
import authRouter from "./auth.js";
const router = express.Router();

router.use("/", staticPagesRouter);
router.use("/auth", authRouter);

export default router;
