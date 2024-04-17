import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { fundWallet, getEWallet } from "../controllers/eWallet.js";
const eWalletRouter = express.Router();

eWalletRouter.get("", isAuthenticated, getEWallet);
eWalletRouter.get("/fund-wallet", isAuthenticated, fundWallet);

export default eWalletRouter;
