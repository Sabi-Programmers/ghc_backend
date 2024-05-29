import express from "express";
import { getProductsPage } from "../controllers/products.js";

const productsRouter = express.Router();

productsRouter.get("/products", getProductsPage);

export default productsRouter;
