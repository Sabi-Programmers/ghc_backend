import database from "../libs/prisma.js";

const today = new Date();
today.setHours(0, 0, 0, 0);
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

// const getUserSelectedDetails = async (id, ) => {
//  const  = []

//   const include = {}

//   const data = await database.user.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       withdrawalWallet: true,
//       unclaimedRewards: true,
//       completionBonus: true,
//       cycleWelcomeBonus: true,
//       referrerIncome: true,
//       testimonyBonus: true,
//       salesIncomeBonus: true,
//       eWallet: true,
//       bronze: true,
//       gold: true,
//       diamond: true,
//       cycleLeaderBonus: true,
//     },
//   });

//   return data;
// };
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
      testimonyBonus: true,
      salesIncomeBonus: true,
      eWallet: true,
      bronze: true,
      gold: true,
      diamond: true,
      cycleLeaderBonus: true,
    },
  });

  return data;
};

const getAllUsers = async (data) => {
  const { page, perPage, membersStatus, searchQuery } = data;

  const whereClause = {};

  if (membersStatus === "active") {
    whereClause.OR = [
      { bronze: { currentCycle: { gt: 0 } } },
      { gold: { currentCycle: { gt: 0 } } },
      { diamond: { currentCycle: { gt: 0 } } },
    ];
  }

  if (searchQuery) {
    const searchConditions = [
      { username: { contains: searchQuery, mode: "insensitive" } },
      { fullName: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
      { sponsorUsername: { contains: searchQuery, mode: "insensitive" } },
    ];

    if (whereClause.OR) {
      whereClause.AND = { OR: searchConditions };
    } else {
      whereClause.OR = searchConditions;
    }
  }

  const members = await database.user.findMany({
    where: whereClause,
    include: {
      bronze: true,
      gold: true,
      diamond: true,
      withdrawalWallet: true,
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });

  const totalMembers = await database.user.count({ where: whereClause });

  return { members, totalMembers };
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
const getAllUsersByPackage = async (pkg) => {
  const whereClause = {};
  whereClause[pkg] = { totalCycle: { gt: 0 } };
  return await database.user.count({
    where: whereClause,
  });
};

const getUplineDetails = async (id, pkg) => {
  const include = { referrers: { where: { package: pkg.toUpperCase() } } };
  include[pkg] = true;
  return await database.user.findUnique({
    where: { id },
    include,
  });
};

const searchUsers = async (username) => {
  return await database.user.findMany({
    where: {
      username: {
        contains: username,
        mode: "insensitive",
      },
    },
    select: { username: true, fullName: true, displayPhoto: true },
    take: 10,
  });
};
const getUserForRollBack = async (username) => {
  return await database.user.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
      fullName: true,
      withdrawalWallet: true,
    },
  });
};
const getUserForBlocking = async (username) => {
  return await database.user.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
      fullName: true,
    },
  });
};
const blockUser = async (username, reason) => {
  return await database.user.update({
    where: {
      username,
    },
    data: {
      BlockedUser: {
        update: {
          status: true,
          reason,
        },
      },
    },
  });
};
const unblockUser = async (memberId) => {
  return await database.user.update({
    where: {
      id: Number(memberId),
    },
    data: {
      BlockedUser: {
        update: {
          status: false,
          reason: "",
        },
      },
    },
  });
};
const updateUserForRollBack = async (username, wallet, balance) => {
  const updatedWallet = {};
  updatedWallet[wallet] = balance;
  return await database.user.update({
    where: {
      username,
    },
    data: {
      withdrawalWallet: {
        update: updatedWallet,
      },
    },
  });
};

const getAllBlockedUsers = async (page, perPage, searchQuery) => {
  const whereClause = {
    BlockedUser: {
      status: true,
    },
  };

  if (searchQuery) {
    whereClause.OR = [
      { username: { contains: searchQuery, mode: "insensitive" } },
      { fullName: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const members = await database.user.findMany({
    where: whereClause,
    include: {
      BlockedUser: true,
      bronze: {
        select: {
          currentCycle: true,
        },
      },
      gold: {
        select: {
          currentCycle: true,
        },
      },
      diamond: {
        select: {
          currentCycle: true,
        },
      },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.blockedUser.findMany();
  return { members, totalItem };
};

const userServices = {
  getAllBlockedUsers,
  getUserForRollBack,
  getUserForBlocking,
  blockUser,
  unblockUser,
  updateUserForRollBack,
  searchUsers,
  getUserDashboardDetails,
  getAllUsers,
  getTotalUsers,
  getAllUsersJoinedToday,
  getAllUsersJoinedThisMonth,
  getAllUsersJoinedThisYear,
  getUplineDetails,
  getAllUsersByPackage,
};
export default userServices;
