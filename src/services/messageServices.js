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
const getSingleMessage = async (userId, id, reqUser) => {
  let message = null;

  message = await database.message.findFirst({
    where: { userId: Number(userId), id: Number(id) },
  });

  if (message.unread) {
    if (
      (message.sender === "ADMIN" && reqUser === "MEMBER") ||
      (message.sender === "USER" && reqUser === "ADMIN")
    ) {
      await database.message.update({
        where: { userId: Number(userId), id: Number(id) },
        data: {
          unread: false,
        },
      });
    }
  }

  return message;
};

const getMessages = async (page, perPage, sender = null, userId = null) => {
  const whereClause = {};
  if (userId) {
    whereClause.userId = userId;
  }

  if (sender && sender === "sent") {
    whereClause.sender = "ADMIN";
  } else if (sender && sender === "received") {
    whereClause.sender = "USER";
  }
  const messages = await database.message.findMany({
    where: whereClause,
    include: {
      User: { select: { username: true, id: true } },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItems = await database.message.count({
    where: whereClause,
  });
  return { messages, totalItems };
};

const delMessage = async (id) => {
  return await database.message.delete({ where: { id: Number(id) } });
};

export {
  createMessage,
  getUserMessages,
  getSingleMessage,
  getMessages,
  delMessage,
};
