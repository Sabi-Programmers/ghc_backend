import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  getSingleProduct,
  getAllProducts,
} from "../services/productServices.js";
import { calculatePagination } from "../utils/index.js";

const getProductsPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    path: req.baseUrl,
  };

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page
  const productType = req.query.t || "all";
  const category = req.query.c || "all";

  // await generateProduct();

  const { products, totalItem } = await getAllProducts(
    page,
    perPage,
    productType,
    category
  );

  data.products = products;
  data.pagination = calculatePagination(totalItem, page, perPage);
  data.page = page;
  data.perPage = perPage;
  data.productType = productType;
  data.category = category;

  if (!req.user || req.user.role !== "MEMBER") {
    return res.render("staticPages/shop/products", {
      title: "Products",
      data,
    });
  }

  res.render("member/shop/products", {
    title: "Products",
    data,
  });
});

const getSingleProductPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    path: req.baseUrl,
  };

  const slug = req.params.slug;

  data.product = await getSingleProduct(slug);

  if (!req.user || req.user.role !== "MEMBER") {
    return res.render("staticPages/shop/single-product", {
      title: data.product.name,
      data,
      path: req.path,
    });
  }

  res.render("member/shop/single-product", {
    title: data.product.name,
    data,
  });
});

const getCartPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    path: req.baseUrl,
  };

  if (!req.user || req.user.role !== "MEMBER") {
    return res.render("staticPages/shop/cart", {
      title: "Cart",
      data,
    });
  }

  res.render("member/shop/cart", {
    title: "Cart",
    data,
  });
});
const getCheckoutPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    path: req.baseUrl,
  };

  if (!req.user || req.user.role !== "MEMBER") {
    return res.render("staticPages/shop/checkout", {
      title: "Checkout Order",
      data,
    });
  }

  res.render("member/shop/checkout", {
    title: "Checkout Order",
    data,
  });
});

export { getProductsPage, getSingleProductPage, getCartPage, getCheckoutPage };
