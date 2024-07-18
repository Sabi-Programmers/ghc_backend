import database from "../libs/prisma.js";

const getContants = async () => {
  return await database.contants.findUnique({ where: { id: 1 } });
};

export { getContants };
