import asyncWrapper from "../../middlewares/asyncWrapper.js";

const getAdminDashboard = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };
  //   if (req.user.hasFunded) {
  //     data.user = await getUserDashboardDetails(req.user.id);
  //   } else {
  //     data.user = req.user;
  //   }
  console.log(data);

  res.render("admin/dashboard/dashboard", {
    title: "Admin Dashboard",
    data,
  });
});

export { getAdminDashboard };
