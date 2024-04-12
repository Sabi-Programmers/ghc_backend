import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";

const getDashbord = asyncWrapper(async (req, res) => {
  const data = await database.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      withdrawalWallet: true,
      unclaimedRewards: true,
      completionBonus: true,
      cycleWelcomeBonus: true,
      referrerIncome: true,
      leaderCycleBonus: true,
      testimonyBonus: true,
      salesIncomeBonus: true,
      eWallet: true,
    },
  });
  console.log(data);
  res.render("member/dashboard", { title: "Dashboard", data });
});

export { getDashbord };
