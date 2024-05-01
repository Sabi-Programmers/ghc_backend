import database from "../libs/prisma.js";

const getExistingReferrals = async (userId, packages) => {
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

export { getExistingReferrals, createReferralsNoUpline };
