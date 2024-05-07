import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  getEwallet,
  getEwalletBalanceUSD,
  updateEwalletBalanceUSD,
} from "../services/eWalletServices.js";
import userServices from "../services/userServices.js";
import { getPackagesPrice } from "../services/packagePrices.js";
import {
  addUserToUplinePackages,
  createPackages,
  getUplinePackages,
  getUserPackage,
  updateUplinePackage,
  updateUserPackage,
} from "../services/packageServices.js";
import {
  addReferralIncome,
  createReferralUplineNoPackage,
  createReferralsNoUpline,
  createReferralsUplineWithGen,
  getExistingReferrals,
  getUplineGenealogy,
  updateUplineRefferalBonus,
} from "../services/referralServices.js";
import { updateUplineUnclaimedBonus } from "../services/unclaimedBonus.js";
import { convertToNGN } from "../utils/index.js";
import { getTotalPackageOrderedPrice } from "../utils/packages.js";
import response from "../utils/response.js";
import { getContants } from "../services/contantsServices.js";
import { createPackageOrders } from "../services/packageOrderServices.js";

const buyPackages = asyncWrapper(async (req, res) => {
  const { id: userId, sponsorUsername, sponsorId, username } = req.user;
  const packages = req.body;

  /**
   * General Logic for all users types
   */

  //first get the packages price from the db
  const prices = await getContants();

  // then get the balance from the users ewallet account
  const balance = await getEwalletBalanceUSD(userId, prices.usdRate);

  // Calculate total price for all packages
  const total = getTotalPackageOrderedPrice(packages, prices);

  if (total > balance) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Insufficient funds"
    );
  }

  const sum = balance - total;
  const newBalance = convertToNGN(sum, prices.usdRate);
  await updateEwalletBalanceUSD(userId, newBalance);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Get UserPackage
  // const userPkg = await getUserPackage(userId, "bronze");
  // const newUserPkg = await updateUserPackage("bronze", userId, 1, userPkg);
  // // ok  -e//

  // const pkgOrders = await createPackageOrders(userId, "bronze", 1);
  // ok -e//

  // Get Upline Info
  const uplineData = await userServices.getUplineDetails(sponsorId, "bronze");
  // ok -e//

  // referral bonus to upline
  // const uplineRefBouns = await updateUplineRefferalBonus(
  //   uplineData,
  //   "bronze",
  //   prices
  // );
  // ok -f//

  // update upline package Data
  // const updatedUplinePackageData = await updateUplinePackage(
  //   uplineData,
  //   "bronze"
  // );
  // ok -f//

  // update upline unclaimed bonus Data
  // const unclaimedBonus = await updateUplineUnclaimedBonus(
  //   uplineData.id,
  //   "bronze",
  //   prices
  // );
  // ok -f//

  return response.json(
    res,
    StatusCodes.CREATED,
    true,
    "Package Purchased Successfully"
  );
});

const getPackages = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.prices = await getPackagesPrice();

  res.render("member/packages/buy-packages", { title: "Pick A Package", data });
});
const completePackageOrder = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.ewallet = await getEwallet(req.user.id);
  data.prices = await getPackagesPrice();

  res.render("member/packages/complete-packages-order", {
    title: "Complete Package Order",
    data,
  });
});

export { buyPackages, getPackages, completePackageOrder };
