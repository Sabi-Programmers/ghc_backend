import express from "express";
import {
  getReferrerTreePage,
  getMyReferrersPage,
} from "../controllers/network.js";

const networkRouter = express.Router();

networkRouter.get("/referrer-tree", getReferrerTreePage);
networkRouter.get("/my-referrers", getMyReferrersPage);

export default networkRouter;
