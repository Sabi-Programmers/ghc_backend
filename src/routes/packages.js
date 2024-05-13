import express from "express";
import {
  buyPackages,
  getPackages,
  completePackageOrder,
  getSuccessPage,
} from "../controllers/packages.js";
const packagesRouter = express.Router();

packagesRouter.get("/", getPackages);
packagesRouter.get("/complete-order", completePackageOrder);
packagesRouter.get("/order-successful", getSuccessPage);
packagesRouter.post("/", buyPackages);

export default packagesRouter;
