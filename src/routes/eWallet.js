import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getEWallet } from "../controllers/eWallet.js";
const eWalletRouter = express.Router();

eWalletRouter.get("", isAuthenticated, getEWallet);

export default eWalletRouter;
