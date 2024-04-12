import database from "../libs/prisma.js";

const getUserDashboardDetails = async (id) => {
  const data = await database.user.findUnique({
    where: {
      id,
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

  return data;
};

export { getUserDashboardDetails };
