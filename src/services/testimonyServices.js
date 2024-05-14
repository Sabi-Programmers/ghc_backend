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

export { getUserForTestimonyBonus, createTestimonyRequest };
