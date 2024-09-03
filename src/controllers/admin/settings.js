import { StatusCodes } from "http-status-codes";
import database from "../../libs/prisma.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import userServices from "../../services/userServices.js";
import response from "../../utils/response.js";
import {
  convertToNGN,
  convertToUSD,
  generateRandomString,
} from "../../utils/index.js";
import {
  getContants,
  updateContants,
} from "../../services/contantsServices.js";
import { name } from "ejs";

const getFundMemberPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    wallet: "0",
  };

  const member = req.query.member;

  if (member) {
    const prices = await getContants();
    data.member = await userServices.getUserForFunding(member);
    data.wallet = convertToUSD(
      data.member.eWallet.balance,
      prices.usdRate
    ).toLocaleString();
  }

  res.render("admin/settings/fund-member", {
    title: "Fund Member",
    data,
  });
});

const fundMember = asyncWrapper(async (req, res) => {
  const admin = req.user;

  try {
    const { username, amount } = req.body;

    if (!username || !amount) {
      return response.json(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Username and Amount Reqiured"
      );
    }

    // find member
    const member = await database.user.findUnique({
      where: { username },
      select: { username: true, email: true, fullName: true },
    });

    if (!member) {
      return response.json(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Member Not Found"
      );
    }
    const prices = await getContants();
    const transactionReference = `TRX-${generateRandomString(4)}-${Math.floor(Math.random() * 9999) + 1000}${generateRandomString(3)}`;
    const settlementReference = `SRF-${generateRandomString(6)}-${Math.floor(Math.random() * 9999) + 1000}${generateRandomString(5)}`;
    const sessionID = `SID-${generateRandomString(2)}-${Math.floor(Math.random() * 999999) + 100000}${generateRandomString(2)}`;

    const convertedAmount = convertToNGN(amount, prices.usdRate);
    // Create the new transaction
    const trx = await database.transactions.create({
      data: {
        collectionType: "flipped",
        amount: parseFloat(convertedAmount),
        depositorAccountNumber: "-",
        depositorAccountName: "Admin User: " + admin.username,
        narration: `Credited by Admin to ${member.fullName}`,
        channel: "0",
        dateTime: new Date(),
        accountNumber: "-",
        accountName: "-",
        transactionReference,
        originatorBank: "-",
        description: "-",
        settlementReference,
        sessionID,
        uniqueIdentifier: member.email,
      },
    });

    const user = await database.user.findUnique({
      where: { email: trx.uniqueIdentifier },
      include: {
        eWallet: true,
      },
    });

    if (user && user.hasFunded) {
      await database.ewallet.update({
        where: { userId: user.id },
        data: {
          balance: parseFloat((user.eWallet.balance + trx.amount).toFixed(2)),
        },
      });
    } else {
      await database.user.update({
        where: { id: user.id },
        data: {
          hasFunded: true,
          eWallet: {
            update: {
              balance: parseFloat(
                (user.eWallet.balance + trx.amount).toFixed(2)
              ),
            },
          },
        },
        include: {
          eWallet: true,
        },
      });
    }

    return response.json(res, StatusCodes.OK, true, "Member Funded");
  } catch (error) {
    console.log(error);
    return response.json(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      error.message
    );
  }
});

const getSettingsPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
    constants: [],
  };
  const constants = await getContants();

  // Utility function to convert camelCase to "Camel Case" and replace specific words
  const formatLabel = (key) => {
    return key
      .replace(/Ref/g, "Referral") // Replace "Ref" with "Referral"
      .replace(/Threshold/g, "Minimum Withdrawal") // Replace "Threshold" with "Minimum Withdrawal"
      .replace(/([A-Z])/g, " $1") // Add a space before each capital letter
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  // Converting object to desired array format with readable labels
  (data.constants = Object.entries(constants)
    .filter(
      ([key]) => key !== "createdAt" && key !== "updatedAt" && key !== "id"
    ) // Filter out unwanted keys
    .map(([key, value]) => ({
      label: formatLabel(key), // Convert camelCase to readable format
      name: key,
      value,
    }))),
    console.log(data.constants);

  res.render("admin/settings/index", {
    title: "Main Configurations",
    data,
  });
});

const updateSettings = asyncWrapper(async (req, res) => {
  const {
    bankName,
    accountNumber,
    accountName,
    bronze,
    gold,
    diamond,
    bronzeRefBonus,
    goldRefBonus,
    diamondRefBonus,
    bronzeTestimonyBonus,
    goldTestimonyBonus,
    diamondTestimonyBonus,
    bronzeWelcomeBonus,
    goldWelcomeBonus,
    diamondWelcomeBonus,
    bronzeCompletionBonus,
    goldCompletionBonus,
    diamondCompletionBonus,
    bronzeThreshold,
    goldThreshold,
    diamondThreshold,
    leaderCycleThreshold,
    salesIncomeThreshold,
    usdRate,
  } = req.body;

  // List of all fields to check
  const fields = [
    bankName,
    accountNumber,
    accountName,
    bronze,
    gold,
    diamond,
    bronzeRefBonus,
    goldRefBonus,
    diamondRefBonus,
    bronzeTestimonyBonus,
    goldTestimonyBonus,
    diamondTestimonyBonus,
    bronzeWelcomeBonus,
    goldWelcomeBonus,
    diamondWelcomeBonus,
    bronzeCompletionBonus,
    goldCompletionBonus,
    diamondCompletionBonus,
    bronzeThreshold,
    goldThreshold,
    diamondThreshold,
    leaderCycleThreshold,
    salesIncomeThreshold,
    usdRate,
  ];

  // Check if all fields are not empty
  const areAllFieldsFilled = fields.every(
    (field) => field !== undefined && field !== null && field !== ""
  );

  if (!areAllFieldsFilled) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "All fields are required and must not be empty."
    );
  }

  // List of fields to convert to float
  const fieldsToConvert = [
    "bronze",
    "gold",
    "diamond",
    "bronzeRefBonus",
    "goldRefBonus",
    "diamondRefBonus",
    "bronzeTestimonyBonus",
    "goldTestimonyBonus",
    "diamondTestimonyBonus",
    "bronzeWelcomeBonus",
    "goldWelcomeBonus",
    "diamondWelcomeBonus",
    "bronzeCompletionBonus",
    "goldCompletionBonus",
    "diamondCompletionBonus",
    "bronzeThreshold",
    "goldThreshold",
    "diamondThreshold",
    "leaderCycleThreshold",
    "salesIncomeThreshold",
    "usdRate",
  ];

  // Parse float for the fields that need conversion
  const data = {
    bankName,
    accountNumber,
    accountName,
    ...Object.fromEntries(
      fieldsToConvert.map((key) => [key, parseFloat(req.body[key])])
    ),
  };

  await updateContants(data);
  return response.json(res, StatusCodes.OK, true, "Configuration Updated");
});

export { getFundMemberPage, fundMember, updateSettings, getSettingsPage };
