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

export {
  getEwallet,
  getEwalletBalanceUSD,
  getEwalletBalanceNGN,
  updateEwalletBalanceUSD,
};
