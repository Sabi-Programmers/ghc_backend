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

export { getWithdrawalWallet, minusWithdrawalWallet, createWithdrawalRequest };
