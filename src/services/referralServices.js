import database from "../libs/prisma.js";

const updateUplineRefferalBonus = async (uplineData, pkg, contants) => {
  if (uplineData[pkg].usedSlots < uplineData[pkg].totalSlots) {
    return await database.referrerIncome.create({
      data: {
        userId: uplineData.id,
        amount: contants[pkg + "RefBonus"],
        cycle: uplineData[pkg].currentCycle,
        package: pkg.toUpperCase(),
      },
    });
  }
  return false;
};

const createReferrersData = async (uplineData, userId, pkg) => {
  const data = {
    userId,
    package: pkg.toUpperCase(),
  };

  if (uplineData === null) {
    data.first = "GHC";
  } else {
    data.first = uplineData.username;
    data.second = uplineData.referrers.first;
    data.third = uplineData.referrers.second;
    data.forth = uplineData.referrers.third;
    data.fifth = uplineData.referrers.forth;
  }

  return await database.referrers.create({
    data,
  });
};

export { updateUplineRefferalBonus, createReferrersData };

/**
 * 
 * 
 * const getExistingReferrals = async (userId, packages) => {
  const packagesPurchasedArray = Object.keys(packages).map((packageName) => ({
    package: packageName.toUpperCase(),
  }));

  // Check if Referral records already exist for the user and packages purchased
  return await database.referral.findMany({
    where: {
      userId,
      OR: packagesPurchasedArray,
    },
    select: { genealogy: true, package: true },
  });
};

const getUplineGenealogy = async (sponsorId, pkg) => {
  return await database.referral.findFirst({
    where: { userId: sponsorId, package: pkg.toUpperCase() },
    select: { genealogy: true },
  });
};

const createReferralsNoUpline = async (userId, packages, sponsorUsername) => {
  const dataArray = packages.map((pkg) => ({
    userId,
    genealogy: { 1: "GHC" },
    package: pkg.toLocaleUpperCase(),
  }));

  return await new Promise(async (resolve, reject) => {
    if (sponsorUsername === "GHC") {
      await database.referral.createMany({
        data: dataArray,
      });

      resolve(true);
    } else {
      resolve(false);
    }
  });
};
const createReferralUplineNoPackage = async (userId, pkg) => {
  return await database.referral.create({
    data: {
      userId,
      genealogy: { 1: "GHC" },
      package: pkg.toLocaleUpperCase(),
    },
  });
};

const createReferralsUplineWithGen = async (userId, pkg, genealogy) => {
  return await database.referral.create({
    data: {
      package: pkg.toUpperCase(),
      userId,
      genealogy,
    },
  });
};

const addReferralIncome = async (sponsorId, pkg, prices) => {
  const packageBonus = prices[`${pkg}RefBonus`];
  const data = {};

  data[pkg] = { increment: packageBonus };

  return await database.referrerIncome.update({
    where: { userId: sponsorId },
    data,
  });
};
 */
