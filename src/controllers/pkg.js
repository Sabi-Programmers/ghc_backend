/*

const buyPackages = asyncWrapper(async (req, res) => {
    const { id: userId, sponsorUsername, sponsorId, username } = req.user;
  
    //first get the packages price from the db
    const prices = await getPackagesPrice();
    console.log(prices);
  
    // then get the balance from the users ewallet account
    const balance = await getEwalletBalanceUSD(userId, prices.usdRate);
    console.log(balance);
    if (!balance) {
      return res.status(500).json({ ewallet: "Not Found" });
    }
  
    // get packages from the request body
    const packages = req.body;
    console.log(packages);
  
    // Calculate total price for all packages
    const total = getTotalPackageOrderedPrice(packages, prices);
    console.log(total);
    if (total > balance) {
      return res.status(500).json({ message: "Insufficient balance" });
    }
  
    const sum = balance - total;
    const newBalance = convertToNGN(sum, prices.usdRate);
    const newE = await updateEwalletBalanceUSD(userId, newBalance);
  
    return res.status(200).json({
      message: "Here are the stop",
      prices,
      balance,
      packages,
      total,
      newE,
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

  **/
