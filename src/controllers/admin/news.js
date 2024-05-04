import asyncWrapper from "../../middlewares/asyncWrapper.js";
import {
  addNews,
  getAllNews,
  getSinglenews,
} from "../../services/newsServies.js";
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

const getANews = asyncWrapper(async (req, res, next) => {
  let data = {
    user: req.user,
  };

  const slug = req.params.slug;
  data.news = await getSinglenews(slug);

  if (!data.news) {
    return next();
  }
  return res.render("admin/news/single-news", {
    title: data.news.title,
    data,
  });
});

const createNews = asyncWrapper(async (req, res) => {
  const { title, description } = req.body;
  const photo = req.file.filename;
  const news = await addNews({ title, description, photo });

  return res.status(201).json({
    success: true,
    data: { slug: news.slug },
  });
});

export { getNews, getANews, createNews };
