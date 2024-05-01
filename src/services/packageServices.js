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

const getUplinePackages = async (packages, sponsorId) => {
  const result = {};

  await Promise.all(
    packages.map(async (pkg) => {
      result[pkg] = await database.package.findFirst({
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

  return result;
};

const addUserToUplinePackages = async (sponsorId, username, pkgData) => {
  return await database.package.update({
    where: { userId: sponsorId, id: pkgData.id },
    data: {
      availableSlot: { decrement: 1 },
      packageDownlines: [...pkgData.packageDownlines, username],
    },
  });
};

export { createPackages, getUplinePackages, addUserToUplinePackages };
