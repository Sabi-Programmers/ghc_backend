import database from "../libs/prisma.js";

const getWithdrawalWallet = async (userId) =>
  await database.withdrawalWallet.findFirst({ where: { userId } });

const minusWithdrawalWallet = async (userId, amount, wallet) => {
  const data = {};
  data[wallet] = { decrement: amount };
  return await database.withdrawalWallet.update({
    where: { userId },
    data,
  });
};

const createWithdrawalRequest = async (userId, amount, wallet) =>
  await database.withdrawalRequest.create({
    data: {
      amount,
      wallets: wallet.toUpperCase(),
      userId,
    },
  });
const getWithdrawalRequest = async (userId, wallet, status) => {
  // Initialize the where clause with userId
  const whereClause = { userId };

  // Conditionally add wallet and status to the where clause if they are not null
  if (wallet !== null) {
    whereClause.wallet = wallet;
  }
  if (status !== null) {
    whereClause.status = status;
  }

  // Query the database with the constructed where clause
  return await database.withdrawalRequest.findMany({
    where: whereClause,
  });
};

const getAllWithdrawalRequests = async (page, perPage, wallet, paid) => {
  const whereClause = {};

  whereClause.wallets = wallet.toUpperCase();

  if (!paid) {
    whereClause.status = "PENDING";
  } else {
    whereClause.status = {
      not: "PENDING",
    };
  }

  const requests = await database.withdrawalRequest.findMany({
    where: whereClause,
    include: {
      User: {
        include: {
          withdrawalWallet: true,
        },
      },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItems = await database.withdrawalRequest.count({
    where: whereClause,
  });
  return { requests, totalItems };
};

export {
  getWithdrawalWallet,
  minusWithdrawalWallet,
  createWithdrawalRequest,
  getWithdrawalRequest,
  getAllWithdrawalRequests,
};
