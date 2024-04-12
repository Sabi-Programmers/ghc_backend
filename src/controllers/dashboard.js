import asyncWrapper from "../middlewares/asyncWrapper.js";
import { getUserDashboardDetails } from "../services/userServices.js";

const getDashbord = asyncWrapper(async (req, res) => {
  let data = null;
  if (req.user.hasFunded) {
    data = await getUserDashboardDetails(req.user.id);
  } else {
    data = req.user;
  }
  console.log(data);

  res.render("member/dashboard", { title: "Dashboard", data });
});

export { getDashbord };
