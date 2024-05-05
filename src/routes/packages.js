import express from "express";
import {
  buyPackages,
  getPackages,
  completePackageOrder,
} from "../controllers/packages.js";
const packagesRouter = express.Router();

packagesRouter.get("/", getPackages);
packagesRouter.get("/complete-order", completePackageOrder);
packagesRouter.post("/", buyPackages);

export default packagesRouter;
