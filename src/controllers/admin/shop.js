import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import response from "../../utils/response.js";
import {
  createProduct,
  uploadProductFile,
} from "../../services/productServices.js";

const getAddProductPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  res.render("admin/shop/add-product", {
    title: "Add Product",
    data,
  });
});
const addProduct = asyncWrapper(async (req, res) => {
  console.log(req.body);
  console.log(req.file.filename);

  const product = await createProduct({
    ...req.body,
    photo: req.file.filename,
  });

  return response.json(
    res,
    StatusCodes.CREATED,
    true,
    "Product added successfully",
    product
  );
});
const addProductFile = asyncWrapper(async (req, res) => {
  const product = await uploadProductFile(req.body.id, req.file.filename);

  return response.json(
    res,
    StatusCodes.CREATED,
    true,
    "Product added successfully",
    product
  );
});

export { getAddProductPage, addProduct, addProductFile };
