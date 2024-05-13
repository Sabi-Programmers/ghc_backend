import express from "express";
import { getReferrerTreePage } from "../controllers/network.js";

const networkRouter = express.Router();

networkRouter.get("/referrer-tree", getReferrerTreePage);

export default networkRouter;
