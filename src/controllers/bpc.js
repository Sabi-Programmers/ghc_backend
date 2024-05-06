import asyncWrapper from "../middlewares/asyncWrapper.js";

const getBpcPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  res.render("member/business-promo-contest", {
    title: "Business Promotion Contest",
    data,
  });
});

export { getBpcPage };
