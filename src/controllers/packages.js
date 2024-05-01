import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  getEwallet,
  getEwalletBalanceUSD,
  updateEwalletBalanceUSD,
} from "../services/eWalletServices.js";
import { getPackagesPrice } from "../services/packagePrices.js";
import {
  addUserToUplinePackages,
  createPackages,
  getUplinePackages,
} from "../services/packageServices.js";
import {
  addReferralIncome,
  createReferralUplineNoPackage,
  createReferralsNoUpline,
  createReferralsUplineWithGen,
  getExistingReferrals,
  getUplineGenealogy,
} from "../services/referralServices.js";
import { updateUplineUnclaimedBonus } from "../services/unclaimedBonus.js";
import { convertToNGN } from "../utils/index.js";
import { getTotalPackageOrderedPrice } from "../utils/packages.js";

const buyPackages = asyncWrapper(async (req, res) => {
  const { id: userId, sponsorUsername, sponsorId, username } = req.user;
  const packages = req.body;

  /**
   * General Logic for all users types
   */

  //first get the packages price from the db
  const prices = await getPackagesPrice();

  // then get the balance from the users ewallet account
  const balance = await getEwalletBalanceUSD(userId, prices.usdRate);

  // Calculate total price for all packages
  const total = getTotalPackageOrderedPrice(packages, prices);

  if (total > balance) {
    return res
      .status(400)
      .json({ success: false, message: "Insufficient balance" });
  }

  const sum = balance - total;
  const newBalance = convertToNGN(sum, prices.usdRate);
  await updateEwalletBalanceUSD(userId, newBalance);

  await createPackages(packages, userId);

  const userExistingReferrals = await getExistingReferrals(userId, packages);

  // map across userExistingRefferals to get which packages purchased does not exist in the Referrals Table
  // to newly purchased packages
  const newPurchasedPackages = Object.keys(packages).filter(
    (packageType) =>
      !userExistingReferrals.some(
        (referral) => referral.package === packageType.toUpperCase()
      )
  );

  // User is not purchasing any new packages end here
  if (newPurchasedPackages.length === 0) {
    return res
      .status(201)
      .json({ success: true, message: "Package Purchased Successfully" });
  }

  /**
   * End basic logic
   */

  /**
   *  if no upline create referrals data for user
   */
  const noUpline = await createReferralsNoUpline(
    userId,
    newPurchasedPackages,
    sponsorUsername
  );

  if (noUpline) {
    return res
      .status(201)
      .json({ success: true, message: "Package Purchased Successfully" });
  }
  /**
   *  ============================================
   */

  /**
   * Map through newPurchasedPackage and check if user has upline
   * without the package or available packages slot
   * and return the available packages
   */

  const uplinePackages = await getUplinePackages(
    newPurchasedPackages,
    sponsorId
  );
  console.log(uplinePackages);

  /**
   * When upline does not have the package and available packages slot
   *
   * Loop through the packages and
   */

  const uplineWithoutPackages = async (userId, pkg, sponsorId, prices) => {
    // Create user package refferal table with GHC
    await createReferralUplineNoPackage(userId, pkg);
    // Add refferal bonus to upline unclaimed bouns with the package
    await updateUplineUnclaimedBonus(sponsorId, pkg, prices);
  };

  /**
   * ==========================================
   */

  /**
   * When upline has package and available packages slot
   */
  const uplineHasPackages = async (
    sponsorId,
    pkg,
    prices,
    value,
    username,
    sponsorUsername,
    userId
  ) => {
    // ===== Upline ======= //
    // add refferal bonus to upline refferal income
    await addReferralIncome(sponsorId, pkg, prices);
    // add to package cycle JSON array and decrease availableSlot
    await addUserToUplinePackages(sponsorId, username, value);
    // get refferal genelogy
    const uplineGenealogy = await getUplineGenealogy(sponsorId, pkg);
    console.log(uplineGenealogy);

    //  ===== User ======== //
    // generate the genelogy for from upline genelogy
    const newGen = { 1: sponsorUsername };

    Object.entries(uplineGenealogy.genealogy).map(([key, value]) => {
      const generation = Number(key);
      if (generation < 6) {
        newGen[(generation + 1).toString()] = value;
      }
    });

    // create Refferal Table and Genelogy
    await createReferralsUplineWithGen(userId, pkg, newGen);
  };

  /**
   * ============================================
   */

  const packagesPurchasingHandler = async () => {
    return new Promise(async (resolve, reject) => {
      await Promise.all(
        Object.entries(uplinePackages).map(async ([pkg, value]) => {
          if (value === null) {
            await uplineWithoutPackages(userId, pkg, sponsorId, prices);
          } else {
            await uplineHasPackages(
              sponsorId,
              pkg,
              prices,
              value,
              username,
              sponsorUsername,
              userId
            );
          }
        })
      );
      resolve(true);
    });
  };

  await packagesPurchasingHandler();

  return res.status(200).json({
    success: true,
    message: "Here are the stop",
  });

  if (nonExistingReferrals.length === 0) {
    return res.status(201).json({ message: "Referral Table already exist" });
  }

  const checkIfGHCIsSposnor = new Promise((resolve, reject) => {
    if (sponsorUsername === "GHC") {
      const promises = Object.keys(packages).map(async (packageType) => {
        await database.referral.create({
          data: {
            userId,
            genealogy: { 1: "GHC" },
            package: packageType.toLocaleUpperCase(),
          },
        });
      });

      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      resolve(false);
    }
  });

  const checkIfGHCIsSposnorResult = await checkIfGHCIsSposnor;

  if (checkIfGHCIsSposnorResult) {
    return res.status(201).json({ message: "Done Here cause GHC is sponsor" });
  }

  // get upline packages
  const getSponsorPackages = new Promise(async (resolve, reject) => {
    const data = {};
    await Promise.all(
      nonExistingReferrals.map(async (pkg) => {
        data[pkg] = await database.package.findFirst({
          where: {
            userId: sponsorId,
            package: pkg.toUpperCase(),
            availableSlot: { gt: 0 },
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      })
    );
    resolve(data);
  });

  const sponsorPackages = await getSponsorPackages;

  // check if upline as the same package been bought
  await Promise.all(
    Object.entries(sponsorPackages).map(async ([packageType, spPkg]) => {
      console.log(packageType, spPkg);
      // if null create a refferal table with GHC as 1st Gen
      if (!spPkg) {
        const referralTable = await database.referral.create({
          data: {
            userId,
            genealogy: { 1: "GHC" },
            package: packageType.toLocaleUpperCase(),
          },
        });
      } else {
        // add downline to upline package cycle
        await database.package.update({
          where: { id: sponsorPackages[packageType].id },
          data: {
            packageDownlines: [
              ...sponsorPackages[packageType].packageDownlines,
              username,
            ],
            availableSlot: { decrement: 1 },
          },
        });

        // create the refferal table
        const sponsorRefferalTable = await database.referral.findFirst({
          where: {
            userId: sponsorId,
            package: packageType.toLocaleUpperCase(),
          },
        });
        const genealogy = sponsorRefferalTable.genealogy;
        const newGenealogy = {
          1: sponsorUsername,
          ...Object.entries(genealogy).reduce((acc, [key, value], index) => {
            acc[index + 2] = value;
            return acc;
          }, {}),
        };

        const downlineRefferalTable = await database.referral.create({
          data: {
            package: packageType.toLocaleUpperCase(),
            userId,
            genealogy: newGenealogy,
          },
        });

        console.log(downlineRefferalTable);
      }
    })
  );

  res.json({
    success: true,
    message: "Successfully created Purchased Your packages",
  });
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
