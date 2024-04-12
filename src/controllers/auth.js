import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { generateVitualBankDetails } from "../services/virtualBank.js";

const getSponsor = asyncWrapper(async (req, res) => {
  const { sponsorId } = req.query;

  //   console.log(req.body);
  let sponsorUsername = null;
  let error = null;
  if (sponsorId) {
    if (sponsorId === "GHC") {
      sponsorUsername = sponsorId;
    } else {
      const sponsor = await database.user.findFirst({
        where: { username: sponsorId.toLowerCase() },
      });
      if (sponsor) {
        sponsorUsername = sponsor.username;
      } else {
        error = "Could not sponsor";
      }
    }
  }

  res.render("auth/register", {
    title: "Create an account",
    sponsorUsername,
    error,
  });
});
const createUser = asyncWrapper(async (req, res, next) => {
  const {
    username,
    password,
    phone,
    fullName,
    sponsorUsername,
    city,
    country,
    email,
    gender,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await database.user.create({
    data: {
      username: username.toLowerCase(),
      password: hashedPassword,
      phone,
      email: email.toLowerCase(),
      city,
      country,
      sponsorUsername,
      fullName,
      gender,
    },
  });

  const virtualBankDetails = await generateVitualBankDetails(
    user.fullName,
    next
  );

  if (virtualBankDetails === null) {
    res.redirect("/auth/login");
  }

  const { virtualBankName, accountName, accountNumber } = virtualBankDetails;

  await database.ewallet.create({
    data: {
      userId: user.id,
      virtualBankName,
      accountName,
      accountNumber,
    },
  });

  res.redirect("/auth/login");
});

export { createUser, getSponsor };
