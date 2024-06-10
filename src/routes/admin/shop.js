import express from "express";
import { uploadImage, uploadPDF } from "../../middlewares/upload.js";
import {
  getAddProductPage,
  addProduct,
  addProductFile,
} from "../../controllers/admin/shop.js";

const shopRouter = express.Router();

shopRouter.get("/add-product", getAddProductPage);
shopRouter.post("/add-product", uploadImage.single("photo"), addProduct);
shopRouter.post("/add-product/file", uploadPDF.single("file"), addProductFile);

export default shopRouter;
