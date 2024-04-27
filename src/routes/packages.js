import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { buyPackages } from "../controllers/packages.js";
const packagesRouter = express.Router();

packagesRouter.post("/", isAuthenticated, buyPackages);

export default packagesRouter;
