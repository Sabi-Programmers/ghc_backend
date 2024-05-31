import database from "../libs/prisma.js";

const createdManyOrders = async (data) => {
  return await database.shopOrders.createMany({
    data,
  });
};

export { createdManyOrders };
