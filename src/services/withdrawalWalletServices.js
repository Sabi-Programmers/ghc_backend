import database from "../libs/prisma.js";

const getWithdrawalWallet = async (userId) => {
  return await database.withdrawalWallet.findFirst({ where: { userId } });
};

const minusWithdrawalWallet = async (userId, amount, wallet) => {
  const data = {};
  data[wallet] = { decrement: amount };
  return await database.withdrawalWallet.update({
    where: { userId: userId },
    data,
  });
};

const createWithdrawalRequest = async (userId, amount, wallet) => {
  return await database.withdrawalRequest.create({
    data: {
      amount,
      wallets: wallet.toUpperCase(),
      userId,
    },
  });
};
const getWithdrawalRequest = async (userId, wallet, status) => {
  // Initialize the where clause with userId
  let whereClause = { userId };

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

export {
  getWithdrawalWallet,
  minusWithdrawalWallet,
  createWithdrawalRequest,
  getWithdrawalRequest,
};
