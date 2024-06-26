import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import passport from "passport";
import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import response from "../utils/response.js";
import {
  sendWelcomeMail,
  sendresetPasswordOtpMail,
} from "../libs/nodemailer.js";
import { generateOtpToken, verifyOtpToken } from "../services/otpServices.js";
// import { getAllBanksInfo } from "../libs/paymentGateway.js";
import countryNames from "../utils/countriesData.js";
import bankSystem from "../libs/bankSystem.js";

const getRegisterPage = asyncWrapper(async (req, res) => {
  const { sponsorId } = req.query;

  let sponsorUsername = null;
  let sponsorID = 0;
  let error = null;
  let banks = null;
  let countries = countryNames;
  if (sponsorId) {
    if (sponsorId === "GHC") {
      sponsorUsername = sponsorId;
    } else {
      const sponsor = await database.user.findFirst({
        where: { username: sponsorId.toLowerCase() },
      });
      if (sponsor) {
        sponsorUsername = sponsor.username;
        sponsorID = sponsor.id;
      } else {
        error = "Could not find Sponsor";
      }
    }

    const bank = await bankSystem.init();

    const getBanks = await bankSystem.getBankList(
      bank.Authorisation.accesscode
    );
    banks = getBanks.BankList;
  }

  res.render("auth/register", {
    title: "Create an account",
    data: { sponsorUsername, sponsorID, banks, error, countries },
  });
});

const getUserAccountName = asyncWrapper(async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  if (!accountNumber || !bankCode) {
    return response.json(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
      "Account number or bank code is missing"
    );
  }

  const bank = await bankSystem.init();

  if (!bank) {
    return response.json(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "No bank"
    );
  }
  if (bank && bank.message !== "Successfully!") {
    return response.json(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      bank.message
    );
  }

  const accName = await bankSystem.getAccName(bank.Authorisation.accesscode, {
    RecipientBankCode: bankCode,
    RecipientAccountNumber: accountNumber,
  });

  if (!accName) {
    return response.json(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Invalid account number"
    );
  }

  const accountName = accName.AccountDetails.RecipientAccountName;

  return response.json(
    res,
    StatusCodes.OK,
    true,
    "Account Name Found",
    accountName
  );
});

const createUser = asyncWrapper(async (req, res) => {
  const {
    username,
    password,
    phone,
    fullName,
    sponsorUsername,
    sponsorId,
    city,
    country,
    email,
    gender,
    accountName,
    accountNumber,
    bankName,
    bankCode,
  } = req.body;

  try {
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
        sponsorId: Number(sponsorId),
        fullName,
        gender,
        withdrawalWallet: { create: {} },
        unclaimedRewards: { create: {} },
        testimonyBonus: { create: {} },
        bronze: { create: {} },
        gold: { create: {} },
        diamond: { create: {} },
        eWallet: { create: {} },
        accountName,
        accountNumber,
        bankName,
        BlockedUser: { create: {} },
      },
      include: {
        withdrawalWallet: true,
        unclaimedRewards: true,
        bronze: true,
        gold: true,
        diamond: true,
        testimonyBonus: true,
        BlockedUser: true,
        eWallet: true,
      },
    });

    try {
      await sendWelcomeMail(user.fullName, user.email);
    } catch (error) {}

    const bank = await bankSystem.init();

    const data = {
      FirstName: "",
      LastName: "",
      OtherName: "",
      PhoneNumber: phone,
      Gender: gender,
      Email: email,
      CustomerAccountNumber: accountNumber,
      CustomerBankCode: bankCode,
    };
    if (!bank || (bank && bank.message !== "Successfully!")) {
      await database.user.delete({
        where: { id: user.id },
      });
      return response.json(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal Server Error"
      );
    }

    const flippedAcc = await bankSystem.createFlippedAcc(
      bank.Authorisation.accesscode,
      data
    );
    console.log(flippedAcc);
    if (!flippedAcc || flippedAcc.error) {
      await database.user.delete({
        where: { id: user.id },
      });
      return response.json(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal Server Error"
      );
    }
    return response.json(
      res,
      StatusCodes.CREATED,
      true,
      "Account created Successfully"
    );
  } catch (err) {
    let error = "something went wrong";

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        if (err.meta.target.includes("username")) {
          error = "Username already exists";
        } else if (err.meta.target.includes("email")) {
          error = "Email already exists";
        } else if (err.meta.target.includes("phone")) {
          error = "Phone Number already exists";
        } else if (err.meta.target.includes("accountNumber")) {
          error = "Account Number already exists";
        } else {
          error = err.meta.target;
        }
      }
    }

    return response.json(res, StatusCodes.BAD_REQUEST, false, error);
  }
});

const getLoginPage = asyncWrapper(async (req, res) =>
  res.render("auth/login", { title: "Login", data: { error: null } })
);

const loginUser = asyncWrapper(async (req, res, next) => {
  passport.authenticate("member-local", (err, user, info) => {
    if (err) {
      return response.json(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal Server Error"
      );
    }
    if (!user) {
      return response.json(res, StatusCodes.UNAUTHORIZED, false, info.message);
    }

    req.logIn(user, (err) => {
      if (err) {
        return response.json(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "Internal Server Error"
        );
      }

      // If authentication was successful, send a success response
      return response.json(res, StatusCodes.OK, true, "Login successful");
    });
  })(req, res, next);
});

const logoutUser = asyncWrapper(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return response.json(res, StatusCodes.OK, true, "Logout successful");
    });
  });
});

const getForgotPasswordPage = asyncWrapper(async (req, res) =>
  res.render("auth/forgot-password", {
    title: "Forgot Password",
    data: { error: null },
  })
);
const forgotPassword = asyncWrapper(async (req, res) => {
  const { username } = req.body;

  if (!username || username.length < 1) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Username or Email is required"
    );
  }

  const user = await database.user.findFirst({
    where: {
      OR: [{ username }, { email: username }],
    },
    select: { fullName: true, email: true, id: true },
  });

  if (!user) {
    return response.json(
      res,
      StatusCodes.NOT_FOUND,
      false,
      "Username or Email not found"
    );
  }

  const otp = await generateOtpToken(user.id);

  const sentMail = await sendresetPasswordOtpMail(
    user.fullName,
    otp,
    user.email
  );

  if (!sentMail) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "OTP Mail Failed"
    );
  }

  return response.json(
    res,
    StatusCodes.OK,
    true,
    "OTP sent to your email address"
  );
});

const getResetPasswordPage = asyncWrapper(async (req, res) => {
  const username = req.query.u;

  if (!username || username.length < 1) {
    return res.redirect("/auth/forgot-password");
  }

  const user = await database.user.findFirst({
    where: {
      OR: [{ username }, { email: username }],
    },
    select: { username: true },
  });

  if (!user) {
    return res.redirect("/auth/forgot-password");
  }

  return res.render("auth/reset-password", {
    title: "Reset Password",
    data: { error: null, username: user.username },
  });
});

const resetPassword = asyncWrapper(async (req, res) => {
  const { username, token, password } = req.body;

  const user = await database.user.findFirst({
    where: {
      OR: [{ username }, { email: username }],
    },
    select: { id: true },
  });

  if (!user) {
    return response.json(
      res,
      StatusCodes.NOT_FOUND,
      false,
      "Username or Email not found"
    );
  }

  // verify OTP
  const verifyOtp = await verifyOtpToken(token, user.id);
  if (!verifyOtp.status) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      verifyOtp.message
    );
  }

  // Update new password
  const hashedPassword = await bcrypt.hash(password, 10);
  await database.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return response.json(
    res,
    StatusCodes.OK,
    true,
    "Password reset successfully"
  );
});

export {
  createUser,
  getRegisterPage,
  getLoginPage,
  loginUser,
  logoutUser,
  getForgotPasswordPage,
  getResetPasswordPage,
  resetPassword,
  forgotPassword,
  getUserAccountName,
};
