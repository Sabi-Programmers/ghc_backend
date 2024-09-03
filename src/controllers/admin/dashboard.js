import asyncWrapper from "../../middlewares/asyncWrapper.js";
import { getTotalIncome } from "../../services/eWalletServices.js";
import userServices from "../../services/userServices.js";
import { getContants } from "../../services/contantsServices.js";
import { convertToUSD } from "../../utils/index.js";

const getAdminDashboard = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const prices = await getContants();

  data.totalMembers = await userServices.getTotalUsers();
  data.joinedToday = await userServices.getAllUsersJoinedToday();
  data.joinedThisMonth = await userServices.getAllUsersJoinedThisMonth();
  data.joinedThisYear = await userServices.getAllUsersJoinedThisYear();
  data.totalBronzeMembers = await userServices.getAllUsersByPackage("bronze");
  data.totalGoldMembers = await userServices.getAllUsersByPackage("gold");
  data.totalDiamondMembers = await userServices.getAllUsersByPackage("diamond");

  const totalIncome = await getTotalIncome();
  data.totalIncome = convertToUSD(totalIncome, prices.usdRate);

  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    data,
  });
});

export { getAdminDashboard };
