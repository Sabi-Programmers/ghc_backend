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

export {
  createdManyOrders,
  ordersTotalAmount,
  updateOrderStatus,
  getTxShopOrders,
};
