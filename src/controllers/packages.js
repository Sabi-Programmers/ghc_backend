import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";

const buyPackages = asyncWrapper(async (req, res) => {
  const { id: userId, sponsorUsername, sponsorId, username } = req.user;
  //first get the packages price from the db
  const prices = await database.packagePrice.findUnique({ where: { id: 1 } });

  // then get the balance from the users ewallet account
  const balanceNGN = await database.ewallet.findFirst({
    where: { userId },
    select: { balance: true },
  });

  if (!balanceNGN) {
    return res.status(500).json({ ewallet: "Not Found" });
  }

  const balance = balanceNGN.balance / prices.usdRate;

  // get packages from the request body
  const packages = req.body;

  // Calculate total price for all packages
  let total = 0;
  Object.entries(packages).forEach(([pkg, unit]) => {
    const price = prices[pkg.toLowerCase()];
    if (price !== undefined) {
      total += price * unit;
      total = Number(total.toFixed(2));
    }
  });

  if (total > balance) {
    return res.status(500).json({ message: "Insufficient balance" });
  }
  let newBalance = (balance - total) * prices.usdRate;
  newBalance = Number(newBalance.toFixed(2));

  //   update the balance
  await database.ewallet.update({
    where: { userId },
    data: { balance: newBalance },
  });

  // Create Packages in the database
  const packageArray = Object.entries(packages).flatMap(
    ([packageType, count]) =>
      Array.from({ length: count }, () => ({
        package: packageType.toUpperCase(),
        packageOrder: {
          create: { userId },
        },
        packageDownlines: [],
      }))
  );

  const newPackages = await database.user.update({
    where: { id: userId },
    data: {
      packages: {
        create: packageArray,
      },
    },
    include: {
      packages: true,
      packageOrders: true,
    },
  });

  // Check if Referral records already exist for the user and packages
  const existingReferrals = await database.referral.findMany({
    where: {
      userId,
      OR: Object.keys(packages).map((packageName) => ({
        package: packageName.toUpperCase(),
      })),
    },
    select: { genealogy: true, package: true },
  });

  const nonExistingReferrals = Object.keys(packages).filter(
    (packageType) =>
      !existingReferrals.some(
        (referral) => referral.package === packageType.toUpperCase()
      )
  );

  if (nonExistingReferrals.length === 0) {
    return res.status(201).json({ message: "Referral Table already exist" });
  }

  const genealogy = {};

  // check if GHC is sposnor
  if (sponsorUsername === "GHC") {
    genealogy["1st"] = "GHC";

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
    existingReferrals,
    nonExistingReferrals,
    genealogy,
    sponsorPackages,
  });
});

const getPackages = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.prices = await database.packagePrice.findUnique({ where: { id: 1 } });

  res.render("member/packages/buy-packages", { title: "Pick A Package", data });
});
const completePackageOrder = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  data.ewallet = await database.ewallet.findFirst({
    where: { userId: req.user.id },
  });
  data.prices = await database.packagePrice.findUnique({ where: { id: 1 } });
  res.render("member/packages/complete-packages-order", {
    title: "Complete Package Order",
    data,
  });
});

export { buyPackages, getPackages, completePackageOrder };
