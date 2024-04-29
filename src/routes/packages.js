import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  buyPackages,
  getPackages,
  completePackageOrder,
} from "../controllers/packages.js";
const packagesRouter = express.Router();

packagesRouter.get("/", isAuthenticated, getPackages);
packagesRouter.get("/complete-order", isAuthenticated, completePackageOrder);
packagesRouter.post("/", isAuthenticated, buyPackages);

export default packagesRouter;
