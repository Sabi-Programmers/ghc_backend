import database from "../libs/prisma.js";

const getPackagesPrice = async () => {
  return await database.packagePrice.findUnique({ where: { id: 1 } });
};

const updatePackagesPrice = async (data) => {
  return await database.packagePrice.update({
    where: { id: 1 },
    data,
  });
};

export { getPackagesPrice, updatePackagesPrice };
