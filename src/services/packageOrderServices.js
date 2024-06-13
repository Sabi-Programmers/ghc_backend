import database from "../libs/prisma.js";
import { durations } from "../utils/index.js";

const createPackageOrders = async (userId, pkg, units) => {
  const prevPkgOrderData = await getLastPackageOrder(userId, pkg);
  const lastCycle = prevPkgOrderData ? prevPkgOrderData.cycle : 0;
  const orders = Array.from({ length: Number(units) }).map((_, i) => ({
    package: pkg.toUpperCase(),
    userId,
    cycle: i + 1 + lastCycle,
  }));

  return await database.packageOrder.createMany({ data: orders });
};

const getLastPackageOrder = async (userId, pkg) =>
  await database.packageOrder.findFirst({
    where: { userId, package: pkg.toUpperCase() },
    orderBy: { createdAt: "desc" },
  });

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

const allPackageOrdered = async ({ page, perPage, duration }) => {
  const dateRange = durations(duration);
  const orders = await database.packageOrder.findMany({
    where: {
      createdAt: { ...dateRange },
    },
    include: {
      User: { select: { username: true, fullName: true } },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.packageOrder.count({
    where: {
      createdAt: { ...dateRange },
    },
  });

  const bronze = await database.packageOrder.count({
    where: {
      package: "BRONZE",
      createdAt: { ...dateRange },
    },
  });
  const gold = await database.packageOrder.count({
    where: {
      package: "GOLD",
      createdAt: { ...dateRange },
    },
  });
  const diamond = await database.packageOrder.count({
    where: {
      package: "DIAMOND",
      createdAt: { ...dateRange },
    },
  });

  return { orders, totalItem, bronze, gold, diamond };
};

const totalPackageOrdered = async () => {
  const bronze = await database.bronze.aggregate({
    _sum: {
      totalCycle: true,
    },
  });
  const gold = await database.gold.aggregate({
    _sum: {
      totalCycle: true,
    },
  });
  const diamond = await database.diamond.aggregate({
    _sum: {
      totalCycle: true,
    },
  });

  return { bronze, gold, diamond };
};

const getAllPackageOrders = async (page, perPage, status, pkg, searchQuery) => {
  const whereClause = {
    status,
    package: pkg.toUpperCase(),
  };

  if (searchQuery) {
    const searchConditions = [
      { User: { username: { contains: searchQuery, mode: "insensitive" } } },
      { User: { fullName: { contains: searchQuery, mode: "insensitive" } } },
    ];

    if (whereClause.OR) {
      whereClause.AND = { OR: searchConditions };
    } else {
      whereClause.OR = searchConditions;
    }
  }

  const orders = await database.packageOrder.findMany({
    where: whereClause,
    include: {
      User: { select: { fullName: true, username: true, phone: true } },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalOrders = await database.packageOrder.count({
    where: whereClause,
  });

  return { orders, totalOrders };
};

const confirmPackageOrderDelivery = async (id) => {
  return await database.packageOrder.update({
    where: { id: Number(id) },
    data: {
      status: "DELIVERED",
    },
  });
};

export {
  confirmPackageOrderDelivery,
  createPackageOrders,
  getUserPackageOrders,
  allPackageOrdered,
  totalPackageOrdered,
  getAllPackageOrders,
};
