import database from "../libs/prisma.js";

const getUserForTestimonyBonus = async (userId) => {
  return await database.testimonyBonus.findUnique({ where: { userId } });
};

const createTestimonyRequest = async (
  userId,
  pkg,
  facebookLink,
  tiktokLink,
  youtubeLink,
  completedCycles,
  lastPaidCycles
) => {
  return await database.testimonyRecords.create({
    data: {
      userId,
      package: pkg.toUpperCase(),
      facebookLink,
      tiktokLink,
      youtubeLink,
      completedCycles,
      lastPaidCycles,
    },
  });
};

const getAllUserTestimony = async (userId, perPage, page) => {
  const testimonies = await database.testimonyRecords.findMany({
    where: { userId },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.testimonyRecords.count({
    where: { userId },
  });

  return { testimonies, totalItem };
};

export {
  getUserForTestimonyBonus,
  createTestimonyRequest,
  getAllUserTestimony,
};
