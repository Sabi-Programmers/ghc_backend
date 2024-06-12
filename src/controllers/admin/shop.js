import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import response from "../../utils/response.js";
import {
  createProduct,
  uploadProductFile,
} from "../../services/productServices.js";
import {
  confirmOrderDelivery,
  getShopOrders,
} from "../../services/shopOrderServices.js";
import { calculatePagination } from "../../utils/index.js";

const getAddProductPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  res.render("admin/shop/add-product", {
    title: "Add Product",
    data,
  });
});
const getPhysicalOrderPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  const searchQuery = req.query.q || null;
  const orderStatus = req.query.st || "all";

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { orders, totalOrders } = await getShopOrders(
    "PHYSICAL",
    page,
    perPage,
    orderStatus,
    searchQuery
  );

  // console.log(orders);
  data.orders = orders;
  data.q = searchQuery;
  data.st = orderStatus;

  data.pagination = calculatePagination(totalOrders, page, perPage);

  res.render("admin/shop/physical-products-orders", {
    title: "Physical Product Orders",
    data,
  });
});
const getDigitalOrderPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  const searchQuery = req.query.q || null;
  const orderStatus = req.query.st || "all";

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { orders, totalOrders } = await getShopOrders(
    "DIGITAL",
    page,
    perPage,
    orderStatus,
    searchQuery
  );

  // console.log(orders);
  data.orders = orders;
  data.q = searchQuery;
  data.st = orderStatus;

  data.pagination = calculatePagination(totalOrders, page, perPage);

  res.render("admin/shop/digital-products-orders", {
    title: "Digital Product Orders",
    data,
  });
});
const addProduct = asyncWrapper(async (req, res) => {
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

const confirmProductDelivery = asyncWrapper(async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return response.json(res, StatusCodes.BAD_REQUEST, false, "Id is required");
  }

  await confirmOrderDelivery(id);

  return response.json(res, StatusCodes.OK, true, "Delivery Confirmed");
});

export {
  getAddProductPage,
  addProduct,
  addProductFile,
  getDigitalOrderPage,
  getPhysicalOrderPage,
  confirmProductDelivery,
};
