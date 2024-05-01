import database from "../libs/prisma.js";

const createPackages = async (packages, userId) => {
  // convert to Array for Packages Database Stuctures to create packages and packages orders
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

  // Create Packages in the database
  return await database.user.update({
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
};

export { createPackages };
