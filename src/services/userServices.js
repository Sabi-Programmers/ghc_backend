import database from "../libs/prisma.js";

const today = new Date();
today.setHours(0, 0, 0, 0);
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

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

const getAllUsers = async () => {
  const users = await database.user.findMany();
  return users;
};

const getTotalUsers = async () => {
  const total = await database.user.count();
  return total;
};

const getAllUsersJoinedToday = async (count) => {
  const usersJoinedTodayCount = await database.user.count({
    where: {
      createdAt: {
        gte: today, // Greater than or equal to the beginning of today
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than the beginning of tomorrow
      },
    },
  });

  return usersJoinedTodayCount;
};

const getAllUsersJoinedThisMonth = async () => {
  const usersJoinedThisMonthCount = await database.user.count({
    where: {
      createdAt: {
        gte: firstDayOfMonth, // Greater than or equal to the first day of this month
        lt: new Date(today.getFullYear(), today.getMonth() + 1, 1), // Less than the first day of next month
      },
    },
  });

  return usersJoinedThisMonthCount;
};
const getAllUsersJoinedThisYear = async () => {
  const usersJoinedThisYearCount = await database.user.count({
    where: {
      createdAt: {
        gte: firstDayOfYear, // Greater than or equal to the first day of this year
        lt: new Date(today.getFullYear() + 1, 0, 1), // Less than the first day of next year
      },
    },
  });

  return usersJoinedThisYearCount;
};

const getUplineDetails = async (id, pkg) => {
  const include = {};
  include[pkg] = true;
  return await database.user.findUnique({
    where: { id },
    include,
  });
};

const userServices = {
  getUserDashboardDetails,
  getAllUsers,
  getTotalUsers,
  getAllUsersJoinedToday,
  getAllUsersJoinedThisMonth,
  getAllUsersJoinedThisYear,
  getUplineDetails,
};
export default userServices;
