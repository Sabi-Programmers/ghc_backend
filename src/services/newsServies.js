import database from "../libs/prisma.js";

const getAllNews = async (page, isPublished) => {
  const skip = (page - 1) * 10;
  const filter = {};

  if (isPublished) {
    filter.isPublished = true;
  }

  const news = await database.news.findMany({
    where: filter,
    skip,
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  const totalNews = await database.news.count();

  return { news, totalNews };
};

export { getAllNews };
