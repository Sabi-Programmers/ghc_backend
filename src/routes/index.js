import express from "express";
import staticPagesRouter from "./staticPagesRoutes.js";
const router = express.Router();

router.use("/", staticPagesRouter);

export default router;
