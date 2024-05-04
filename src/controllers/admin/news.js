import asyncWrapper from "../../middlewares/asyncWrapper.js";
import { getAllNews } from "../../services/newsServies.js";
import { calculatePagination } from "../../utils/index.js";

const getNews = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  const currentPage = Number(req.query.page) || 1;

  const { news, totalNews } = await getAllNews(currentPage);
  data.news = news;

  data.pagination = calculatePagination(totalNews, currentPage, 10);

  return res.render("admin/news/all-news", {
    title: "All News",
    data,
  });
});

export { getNews };
