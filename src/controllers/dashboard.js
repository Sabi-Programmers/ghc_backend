import asyncWrapper from "../middlewares/asyncWrapper.js";
import userServices from "../services/userServices.js";

const getDashbord = asyncWrapper(async (req, res) => {
  let data = {
    user: null,
  };
  if (req.user.hasFunded) {
    data.user = await userServices.getUserDashboardDetails(req.user.id);
  } else {
    data.user = req.user;
  }

  res.render("member/dashboard", { title: "Dashboard", data });
});

const getSuccessPage = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };
  return res.render("member/success", { title: "Success", data });
});

export { getDashbord, getSuccessPage };
