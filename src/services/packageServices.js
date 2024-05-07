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

const updateUserPackage = async (pkg, userId, units, prevPkgData) => {
  const data = {
    totalCycle: prevPkgData.totalCycle + Number(units),
    totalSlots: prevPkgData.totalSlots + Number(units) * 9,
  };

  //update user package current cycle
  if (prevPkgData.usedSlots === prevPkgData.totalSlots) {
    data.currentCycle = prevPkgData.currentCycle + 1;
  }

  return await database[pkg].update({
    where: { userId },
    data,
  });
};

const getUserPackage = async (userId, pkg) => {
  return await database[pkg].findFirst({ where: { userId } });
};

const updateUplinePackage = async (uplineData, pkg) => {
  // update used slot and currentCycle

  const data = {
    usedSlots: { increment: 1 },
  };

  const sum = uplineData[pkg].usedSlots % 9;
  console.log(sum);
  if (sum === 8) {
    data.currentCycle = { increment: 1 };
  }

  return await database["bronze"].update({
    where: { userId: uplineData.id },
    data,
  });
};

export {
  createPackages,
  getUplinePackages,
  addUserToUplinePackages,
  getUserPackage,
  updateUserPackage,
  updateUplinePackage,
};
