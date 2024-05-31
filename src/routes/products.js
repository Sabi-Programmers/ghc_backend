import express from "express";
import {
  getProductsPage,
  getSingleProductPage,
  getCartPage,
  getCheckoutPage,
  checkoutOrder,
  getOrderCompletePage,
} from "../controllers/products.js";

const productsRouter = express.Router();

productsRouter.get("/", getProductsPage);
productsRouter.get("/checkout", getCheckoutPage);
productsRouter.get("/order-complete", getOrderCompletePage);
productsRouter.post("/checkout", checkoutOrder);
productsRouter.get("/product", (req, res) => res.redirect("/shop"));
productsRouter.get("/product/:slug", getSingleProductPage);
productsRouter.get("/cart", getCartPage);

export default productsRouter;
