import database from "../libs/prisma.js";

const getWithdrawalWallet = async (userId) => {
  return await database.withdrawalWallet.findFirst({ where: { userId } });
};

export { getWithdrawalWallet };
