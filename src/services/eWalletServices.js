import database from "../libs/prisma.js";
import { generateVitualBankDetails } from "./virtualBank.js";

const getEwallet = async (userId) =>
  await database.ewallet.findFirst({
    where: { userId },
  });

const getEwalletBalanceNGN = async (userId) =>
  await database.ewallet.findFirst({
    where: { userId },
    select: { balance: true },
  });

const getEwalletBalanceUSD = async (userId, usdRate) => {
  const balanceNGN = await database.ewallet.findFirst({
    where: { userId },
    select: { balance: true },
  });

  return balanceNGN.balance / usdRate;
};

const updateEwalletBalanceUSD = async (userId, balance) =>
  await database.ewallet.update({
    where: { userId },
    data: { balance },
  });

const getUserTransactions = async (userId, page, perPage) => {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  const transactions = await database.transactions.findMany({
    where: { uniqueIdentifier: user.email },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { dateTime: "desc" },
  });

  const totalItem = await database.transactions.count({
    where: { uniqueIdentifier: user.email },
  });
  return { transactions, totalItem };
};

export {
  getEwallet,
  getEwalletBalanceUSD,
  getEwalletBalanceNGN,
  updateEwalletBalanceUSD,
  getUserTransactions,
};
