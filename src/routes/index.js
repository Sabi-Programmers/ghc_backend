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
import marketingRouter from "./marketing.js";
import messagesRouter from "./messages.js";
import bankSystem from "../libs/bankSystem.js";

const router = express.Router();

router.use("/", staticPagesRouter);
router.use("/auth", authRouter);
router.use("/dashboard", isMember, dashboardRouter);
router.use("/e-wallet", isMember, eWalletRouter);
router.use("/packages", isMember, packagesRouter);
router.use("/user", isMember, userRouter);
router.use("/profile", isMember, profileRouter);
router.use("/news", isMember, newsRouter);
router.use("/messages", isMember, messagesRouter);
router.use("/withdrawal", isMember, withdrawalRouter);
router.use("/withdrawal-wallet", isMember, withdrawalWalletsRouter);
router.use("/testimony", isMember, testimonyRouter);
router.use("/business-promo-contest", isMember, bpcRouter);
router.use("/network", isMember, networkRouter);
router.use("/marketing", isMember, marketingRouter);
router.use("/shop", productsRouter);

router.use("/admin", adminRouter);

router.get("/test-bank", async (req, res) => {
  try {
    const bank = await bankSystem.init();
    return res.status(200).json(bank);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
