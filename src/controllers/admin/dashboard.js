import bcrypt from "bcryptjs";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import { getTotalIncome } from "../../services/eWalletServices.js";
import userServices from "../../services/userServices.js";
import { getContants } from "../../services/contantsServices.js";
import { convertToUSD } from "../../utils/index.js";
import {
  changeUserPassword,
  deleteUserOtherSessions,
} from "../../services/profileServices.js";
import database from "../../libs/prisma.js";
import response from "../../utils/response.js";
import { StatusCodes } from "http-status-codes";

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

const getAccountSettings = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  res.render("admin/account-settings/index", {
    title: "Account Settings",
    data,
  });
});

const changePassword = asyncWrapper(async (req, res) => {
  const { oldPassword, password } = req.body;
  const getAdmin = await database.admin.findUnique({
    where: { id: req.user.id },
  });

  if (!getAdmin) {
    return response.json(res, StatusCodes.OK, false, "Invalid password!");
  }

  if (!bcrypt.compareSync(oldPassword, getAdmin.password)) {
    return response.json(res, StatusCodes.OK, false, "Invalid password!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await database.admin.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  await deleteUserOtherSessions(req);

  return response.json(
    res,
    StatusCodes.OK,
    true,
    "Password Changed Successfully"
  );
});

export { getAdminDashboard, getAccountSettings, changePassword };
