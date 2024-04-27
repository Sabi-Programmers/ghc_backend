import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";

const buyPackages = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
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
      }))
  );

  // const newPackages = await database.package.createMany({
  //   data: [{}],
  // });

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

  res.json({ newPackages });
});

export { buyPackages };
