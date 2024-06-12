import database from "../libs/prisma.js";

const createdManyOrders = async (data) => {
  return await database.shopOrders.createMany({
    data,
  });
};

const ordersTotalAmount = async (tx_ref) => {
  return await database.shopOrders.aggregate({
    where: {
      tx_ref,
    },
    _sum: {
      amount: true,
    },
  });
};

const updateOrderStatus = async (tx_ref, type, failed = null) => {
  return await database.shopOrders.updateMany({
    where: {
      tx_ref,
    },
    data: {
      status: failed
        ? "PAYMENT_FAILED"
        : type === "DIGITAL"
        ? "DELIVERED"
        : "PENDING",
    },
  });
};

const getTxShopOrders = async (tx_ref) => {
  return await database.shopOrders.findMany({
    where: {
      tx_ref,
    },
    include: {
      Item: {
        select: {
          productType: true,
          file: true,
        },
      },
    },
  });
};

const getShopOrders = async (
  productType,
  page,
  perPage,
  shopStatus,
  searchQuery
) => {
  const whereClause = {
    Item: {
      productType: productType.toUpperCase(),
    },
  };

  if (shopStatus === "DELIVERED") {
    whereClause.status = "DELIVERED";
  } else if (shopStatus != "all") {
    whereClause.NOT = [{ status: "DELIVERED" }];
  }

  if (searchQuery) {
    const searchConditions = [
      { Item: { name: { contains: searchQuery, mode: "insensitive" } } },
      { fullName: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
      { Seller: { username: { contains: searchQuery, mode: "insensitive" } } },
      { Seller: { fullName: { contains: searchQuery, mode: "insensitive" } } },
    ];

    if (whereClause.OR) {
      whereClause.AND = { OR: searchConditions };
    } else {
      whereClause.OR = searchConditions;
    }
  }

  const orders = await database.shopOrders.findMany({
    where: whereClause,
    include: {
      Item: true,
      Seller: { select: { username: true } },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalOrders = await database.shopOrders.count({
    where: whereClause,
  });

  return { orders, totalOrders };
};

const confirmOrderDelivery = async (id) => {
  return await database.shopOrders.update({
    where: { id: Number(id) },
    data: {
      status: "DELIVERED",
    },
  });
};

export {
  createdManyOrders,
  ordersTotalAmount,
  updateOrderStatus,
  getTxShopOrders,
  getShopOrders,
  confirmOrderDelivery,
};
