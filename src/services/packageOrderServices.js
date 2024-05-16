import database from "../libs/prisma.js";

const createPackageOrders = async (userId, pkg, units) => {
  const prevPkgOrderData = await getLastPackageOrder(userId, pkg);
  const lastCycle = prevPkgOrderData ? prevPkgOrderData.cycle : 0;
  const orders = Array.from({ length: Number(units) }).map((_, i) => {
    return { package: pkg.toUpperCase(), userId, cycle: i + 1 + lastCycle };
  });

  return await database.packageOrder.createMany({ data: orders });
};

const getLastPackageOrder = async (userId, pkg) => {
  return await database.packageOrder.findFirst({
    where: { userId, package: pkg.toUpperCase() },
    orderBy: { createdAt: "desc" },
  });
};

const getUserPackageOrders = async (userId, page, perPage) => {
  const orders = await database.packageOrder.findMany({
    where: {
      userId,
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });

  const totalItem = await database.packageOrder.count({ where: { userId } });

  return { orders, totalItem };
};

export { createPackageOrders, getUserPackageOrders };
