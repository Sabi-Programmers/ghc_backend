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
    if (newEWallet) {
      data.eWallet = newEWallet;
    }
  } else {
    data.eWallet = existingEWallet;
  }

  res.render("member/e-wallet", { title: "E-Wallet", data });
});

const fundWallet = asyncWrapper(async (req, res) => {
  const amount = Number(req.query.amount);
  const id = Number(req.query.id);

  if (req.user && req.user.hasFunded) {
    await database.ewallet.update({
      where: { userId: id },
      data: {
        balance: { increment: amount },
      },
    });
  } else {
    await database.user.update({
      where: { id },
      data: {
        hasFunded: true,
        eWallet: { update: { balance: { increment: amount } } },
      },
      include: {
        eWallet: true,
      },
    });
  }

  res.redirect("/e-wallet");
});

export { getEWallet, fundWallet };
