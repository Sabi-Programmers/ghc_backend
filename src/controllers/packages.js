import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  getEwallet,
  getEwalletBalanceUSD,
  updateEwalletBalanceUSD,
} from "../services/eWalletServices.js";
import userServices from "../services/userServices.js";
import {
  getUserPackage,
  updateUplinePackage,
  updateUserPackage,
} from "../services/packageServices.js";
import {
  createReferrersData,
  updateUplineRefferalBonus,
} from "../services/referralServices.js";
import { updateUplineUnclaimedBonus } from "../services/unclaimedBonus.js";
import { convertToNGN } from "../utils/index.js";
import { getTotalPackageOrderedPrice } from "../utils/packages.js";
import response from "../utils/response.js";
import { getContants } from "../services/contantsServices.js";
import { createPackageOrders } from "../services/packageOrderServices.js";
import {
  updateUplineCycleWelcomeBonus,
  updateUserCycleWelcomeBonus,
  updatedUplineCompBonus,
} from "../services/cycleWelcomeServies.js";
import {
  cycleLeadersPayments,
  makeUserCycleLeader,
} from "../services/cycleLeaderBonus.js";

const buyPackages = asyncWrapper(async (req, res) => {
  try {
    const { id: userId, sponsorId, username, fullName } = req.user;
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

    const actions = async (pkg, unit) => {
      // Get UserPackage
      const userPkg = await getUserPackage(userId, pkg);
      const newUserPkg = await updateUserPackage(pkg, userId, unit, userPkg);
      // // ok  -e//

      await createPackageOrders(userId, pkg, 1);
      // ok -e//

      // Get Upline Info
      const uplineData = await userServices.getUplineDetails(sponsorId, pkg);
      // ok -e//

      if (userPkg.totalCycle === 0) {
        // referral bonus to upline
        await updateUplineRefferalBonus(uplineData, pkg, prices);
        // ok -f//

        // update upline package Data
        const updatedUplinePackageData = await updateUplinePackage(
          uplineData,
          pkg
        );
        // ok -f//

        // update upline unclaimed bonus Data
        await updateUplineUnclaimedBonus(sponsorId, pkg, prices, uplineData);
        // ok -f//

        // update upline welcome bonus
        await updateUplineCycleWelcomeBonus(
          uplineData,
          updatedUplinePackageData,
          pkg,
          prices
        );
        // ok -f//

        // update upline completion bonus
        await updatedUplineCompBonus(updatedUplinePackageData, prices, pkg);
        // ok -f//

        // create user referrers data
        await createReferrersData(uplineData, userId, pkg);
        // ok -f//

        // make Upline a Cycle Leader
        await makeUserCycleLeader(updatedUplinePackageData);
        // ok -f//
      }

      // update user welcome bonus Data
      await updateUserCycleWelcomeBonus(
        userId,
        pkg,
        userPkg,
        newUserPkg,
        prices
      );
      // ok -e//

      // make User a Cycle Leader
      await makeUserCycleLeader(newUserPkg);
      // ok -e//

      await cycleLeadersPayments(userId, pkg, username, fullName);
      // ok -e//
    };

    await Promise.all(
      Object.entries(packages).map(
        async ([key, value]) => await actions(key, value)
      )
    );

    // console.log(uplineData);
    return response.json(
      res,
      StatusCodes.CREATED,
      true,
      "Package Purchased Successfully"
    );
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

const getPackages = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.prices = await getContants();

  res.render("member/packages/buy-packages", { title: "Pick A Package", data });
});
const completePackageOrder = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.ewallet = await getEwallet(req.user.id);
  data.prices = await getContants();

  res.render("member/packages/complete-packages-order", {
    title: "Complete Package Order",
    data,
  });
});

export { buyPackages, getPackages, completePackageOrder };
