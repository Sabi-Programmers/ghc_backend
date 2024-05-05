import asyncWrapper from "../middlewares/asyncWrapper.js";
import { getAllNews, getSinglenews } from "../services/newsServies.js";
import { calculatePagination } from "../utils/index.js";

const getNews = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  const currentPage = Number(req.query.page) || 1;

  const { news, totalNews } = await getAllNews(currentPage);
  data.news = news;

  data.pagination = calculatePagination(totalNews, currentPage, 10);

  return res.render("member/news/all-news", {
    title: "All News",
    data,
  });
});

const getANews = asyncWrapper(async (req, res, next) => {
  let data = {
    user: req.user,
  };

  const slug = req.params.slug;
  data.news = await getSinglenews(slug);

  if (!data.news) {
    return next();
  }
  return res.render("member/news/single-news", {
    title: data.news.title,
    data,
  });
});

export { getNews, getANews };
