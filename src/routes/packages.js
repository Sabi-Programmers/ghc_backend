import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  buyPackages,
  getPackages,
  setPackagesOrder,
} from "../controllers/packages.js";
const packagesRouter = express.Router();

packagesRouter.get("/", isAuthenticated, getPackages);
packagesRouter.post("/", isAuthenticated, setPackagesOrder);
packagesRouter.post("/buy", isAuthenticated, buyPackages);

export default packagesRouter;
