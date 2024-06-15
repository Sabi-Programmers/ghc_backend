import database from "../libs/prisma.js";

const createMessage = async (title, narration, sender, userId) => {
  return await database.message.create({
    data: {
      title,
      narration,
      sender,
      userId: Number(userId),
    },
  });
};

const getUserMessages = async (userId, page, perPage) => {
  const messages = await database.message.findMany({
    where: { userId },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItems = await database.message.count({
    where: { userId },
  });
  return { messages, totalItems };
};
const getSingleMessage = async (userId, id) => {
  return await database.message.update({
    where: { userId, id: Number(id) },
    data: {
      unread: false,
    },
  });
};

export { createMessage, getUserMessages, getSingleMessage };
