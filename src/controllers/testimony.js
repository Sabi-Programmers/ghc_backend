import asyncWrapper from "../middlewares/asyncWrapper.js";

const getAddTestimonyPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  res.render("member/testimony/add-testimony", {
    title: "Add Testimony",
    data,
  });
});

export { getAddTestimonyPage };
