import CustomError from "../errors/CustomError.js";
import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createEWallet } from "../services/eWalletServices.js";

const getEWallet = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
    eWallet: null,
  };
  const existingEWallet = await database.ewallet.findFirst({
    where: {
      userId: req.user.id,
    },
  });
  if (!existingEWallet) {
    const newEWallet = await createEWallet(req.user);
    if (newEWallet) {
      data.eWallet = newEWallet;
    }
  } else {
    data.eWallet = existingEWallet;
  }

  res.render("member/e-wallet", { title: "E-Wallet", data });
});

const fundWallet = asyncWrapper(async (req, res) => {
  const amount = Number(req.query.amount);

  if (req.user.hasFunded) {
    await database.ewallet.update({
      where: { id: req.user.id },
      data: {
        balance: { increment: amount },
      },
    });
  } else {
    await database.user.update({
      where: { id: req.user.id },
      data: {
        hasFunded: true,
        eWallet: { update: { balance: { increment: amount } } },
        withdrawalWallet: { create: {} },
        unclaimedRewards: { create: {} },
        completionBonus: { create: {} },
        referrerIncome: { create: {} },
        testimonyBonus: { create: {} },
        salesIncomeBonus: { create: {} },
        leaderCycleBonus: { create: {} },
        cycleWelcomeBonus: { create: {} },
      },
      include: {
        eWallet: true,
        withdrawalWallet: true,
        unclaimedRewards: true,
        completionBonus: true,
        cycleWelcomeBonus: true,
        referrerIncome: true,
        leaderCycleBonus: true,
        testimonyBonus: true,
        salesIncomeBonus: true,
      },
    });
  }

  res.redirect("/e-wallet");
});

export { getEWallet, fundWallet };
