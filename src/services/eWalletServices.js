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
    return;
  }
};

export { createEWallet };
