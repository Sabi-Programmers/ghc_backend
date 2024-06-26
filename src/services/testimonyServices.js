import database from "../libs/prisma.js";

const getUserForTestimonyBonus = async (userId) =>
  await database.testimonyBonus.findUnique({ where: { userId } });

const createTestimonyRequest = async (
  userId,
  pkg,
  facebookLink,
  tiktokLink,
  youtubeLink,
  completedCycles,
  lastPaidCycles,
  message
) =>
  await database.testimonyRecords.create({
    data: {
      userId,
      package: pkg.toUpperCase(),
      facebookLink,
      tiktokLink,
      youtubeLink,
      completedCycles,
      lastPaidCycles,
      message,
    },
  });

const getAllUserTestimony = async (userId, perPage, page) => {
  const testimonies = await database.testimonyRecords.findMany({
    where: { userId: Number(userId), status: "PENDING" },
    include: { user: { include: { bronze: true, gold: true, diamond: true } } },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.testimonyRecords.count({
    where: { userId: Number(userId), status: "PENDING" },
  });

  return { testimonies, totalItem };
};

const getAllTestimony = async (page, perPage, searchQuery) => {
  const whereClause = { status: "PENDING" };
  if (searchQuery) {
    const searchConditions = [
      { user: { username: { contains: searchQuery, mode: "insensitive" } } },
      { user: { fullName: { contains: searchQuery, mode: "insensitive" } } },
    ];

    if (whereClause.OR) {
      whereClause.AND = { OR: searchConditions };
    } else {
      whereClause.OR = searchConditions;
    }
  }
  const testimonies = await database.testimonyRecords.findMany({
    where: whereClause,
    include: { user: { include: { bronze: true, gold: true, diamond: true } } },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.testimonyRecords.count({
    where: whereClause,
  });

  return { testimonies, totalItem };
};

const rejectUserTestimony = async (userId, id, feedbackMessage) => {
  return await database.testimonyRecords.update({
    where: {
      id: Number(id),
      userId: Number(userId),
    },
    data: {
      feedbackMessage,
      status: "DENIED",
    },
  });
};

export {
  getUserForTestimonyBonus,
  createTestimonyRequest,
  getAllUserTestimony,
  getAllTestimony,
  rejectUserTestimony,
};
