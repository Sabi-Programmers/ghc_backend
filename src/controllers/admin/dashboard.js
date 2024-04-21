import asyncWrapper from "../../middlewares/asyncWrapper.js";
import userServices from "../../services/userServices.js";

const getAdminDashboard = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.totalMembers = await userServices.getTotalUsers();
  data.joinedToday = await userServices.getAllUsersJoinedToday();
  data.joinedThisMonth = await userServices.getAllUsersJoinedThisMonth();
  data.joinedThisYear = await userServices.getAllUsersJoinedThisYear();

  res.render("admin/dashboard/dashboard", {
    title: "Admin Dashboard",
    data,
  });
});

export { getAdminDashboard };
