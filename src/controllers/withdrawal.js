import asyncWrapper from "../middlewares/asyncWrapper.js";
import { getContants } from "../services/contantsServices.js";
import { getWithdrawalWallet } from "../services/withdrawalWalletServices.js";

const getWithdrawalPage = asyncWrapper(async (req, res) => {
  const wallet = req.query.sw;
  const data = {
    user: req.user,
    threshold: null,
    totalBalance: null,
    walletBalance: null,
    wallet: null,
  };
  // get withdrawal wallet balance
  const withdrawWallet = await getWithdrawalWallet(req.user.id);
  const { bronze, gold, diamond, salesIncome, leaderCycle } = withdrawWallet;
  data.totalBalance = bronze + gold + diamond + salesIncome + leaderCycle;

  if (wallet) {
    // getThreshold from constants
    const threshold = await getContants();
    data.threshold = threshold[wallet + "Threshold"];
    data.walletBalance = withdrawWallet[wallet];
    data.wallet = wallet;
  }

  res.render("member/withdrawal/withdrawal-request", {
    title: "Request From Withdrawal",
    data,
  });
});

export { getWithdrawalPage };
