import CustomError from "../errors/CustomError.js";
import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createEWallet } from "../services/eWalletServices.js";

const getEWallet = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
    eWallet: null,
  };
  const existingEWallet = await database.ewallet.findFirst({
    where: {
      userId: req.user.id,
    },
  });
  if (!existingEWallet) {
    const newEWallet = await createEWallet(req.user);
    console.log("E-wallet Contoller: " + newEWallet);
    if (newEWallet) {
      data.eWallet = newEWallet;
    }
  } else {
    data.eWallet = existingEWallet;
  }
  console.log(data.eWallet);
  res.render("member/e-wallet", { title: "E-Wallet", data });
});

export { getEWallet };
