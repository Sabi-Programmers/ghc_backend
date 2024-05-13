import express from "express";
import staticPagesRouter from "./staticPagesRoutes.js";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import eWalletRouter from "./eWallet.js";
import adminRouter from "./admin/index.js";
import packagesRouter from "./packages.js";
import userRouter from "./user.js";
import profileRouter from "./profile.js";
import newsRouter from "./news.js";
import { isMember } from "../middlewares/auth.js";
import withdrawalRouter from "./withdrawal.js";
import testimonyRouter from "./testimony.js";
import bpcRouter from "./bpc.js";
import productsRouter from "./products.js";
import withdrawalWalletsRouter from "./withdrawal-wallets.js";
import networkRouter from "./network.js";
const router = express.Router();

router.use("/", staticPagesRouter);
router.use("/auth", authRouter);
router.use("/dashboard", isMember, dashboardRouter);
router.use("/e-wallet", isMember, eWalletRouter);
router.use("/packages", isMember, packagesRouter);
router.use("/user", isMember, userRouter);
router.use("/profile", isMember, profileRouter);
router.use("/news", isMember, newsRouter);
router.use("/withdrawal", isMember, withdrawalRouter);
router.use("/withdrawal-wallet", isMember, withdrawalWalletsRouter);
router.use("/testimony", isMember, testimonyRouter);
router.use("/business-promo-contest", isMember, bpcRouter);
router.use("/network", isMember, networkRouter);
router.use("/u/products", isMember, productsRouter);

router.use("/admin", adminRouter);

export default router;
