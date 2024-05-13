import asyncWrapper from "../middlewares/asyncWrapper.js";
import { getEwallet } from "../services/eWalletServices.js";
import userServices from "../services/userServices.js";

const getDashbord = asyncWrapper(async (req, res) => {
  let data = {
    user: null,
  };
  if (req.user.hasFunded) {
    data.user = await userServices.getUserDashboardDetails(req.user.id);
    data.withdrawalWallet = {
      total:
        data.user.withdrawalWallet.bronze +
        data.user.withdrawalWallet.gold +
        data.user.withdrawalWallet.diamond +
        data.user.withdrawalWallet.salesIncome +
        data.user.withdrawalWallet.leaderCycle,
      gold: data.user.withdrawalWallet.gold,
      diamond: data.user.withdrawalWallet.diamond,
      bronze: data.user.withdrawalWallet.bronze,
      cycleLeader: data.user.withdrawalWallet.leaderCycle,
      salesIncome: data.user.withdrawalWallet.salesIncome,
    };
    data.referrers = {
      referrers:
        data.user.bronze.usedSlots +
        data.user.gold.usedSlots +
        data.user.diamond.usedSlots,
      bronze: data.user.bronze.usedSlots,
      gold: data.user.gold.usedSlots,
      diamond: data.user.diamond.usedSlots,
    };

    data.nodata = false;
  } else {
    data.user = req.user;
    data.eWallet = await getEwallet(req.user.id);
  }

  res.render("member/dashboard", { title: "Dashboard", data });
});

export { getDashbord };
