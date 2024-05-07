import asyncWrapper from "../middlewares/asyncWrapper.js";

const getProductsPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  res.render("member/shop/products", {
    title: "Products",
    data,
  });
});

export { getProductsPage };
