import database from "../libs/prisma.js";
import { generateVitualBankDetails } from "./virtualBank.js";

const createEWallet = async (user) => {
  try {
    const virtualBankDetails = await generateVitualBankDetails(user);

    if (!virtualBankDetails) {
      return null;
    }

    const { virtualBankName, accountName, accountNumber } = virtualBankDetails;

    const eWallet = await database.ewallet.create({
      data: {
        userId: user.id,
        virtualBankName,
        accountName,
        accountNumber,
      },
    });

    return eWallet;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getEwallet = async (userId) => {
  return await database.ewallet.findFirst({
    where: { userId },
  });
};

const getEwalletBalanceNGN = async (userId) => {
  return await database.ewallet.findFirst({
    where: { userId },
    select: { balance: true },
  });
};

const getEwalletBalanceUSD = async (userId, usdRate) => {
  const balanceNGN = await database.ewallet.findFirst({
    where: { userId },
    select: { balance: true },
  });

  return balanceNGN.balance / usdRate;
};

const updateEwalletBalanceUSD = async (userId, balance) => {
  return await database.ewallet.update({
    where: { userId },
    data: { balance },
  });
};

export {
  createEWallet,
  getEwallet,
  getEwalletBalanceUSD,
  getEwalletBalanceNGN,
  updateEwalletBalanceUSD,
};
