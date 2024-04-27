import express from "express";
import staticPagesRouter from "./staticPagesRoutes.js";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import eWalletRouter from "./eWallet.js";
import adminRouter from "./admin/index.js";
import packagesRouter from "./packages.js";
const router = express.Router();

router.use("/", staticPagesRouter);
router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/e-wallet", eWalletRouter);
router.use("/packages", packagesRouter);

router.use("/admin", adminRouter);

export default router;
