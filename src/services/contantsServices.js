import database from "../libs/prisma.js";

const getContants = async () => {
  return await database.contants.findUnique({ where: { id: 1 } });
};

const createContants = async () => {
  return await database.contants.create({
    data: {
      id: 1,
    },
  });
};

const updateContants = async (data) => {
  return await database.contants.update({
    where: {
      id: 1,
    },
    data,
  });
};

export { getContants, createContants, updateContants };
