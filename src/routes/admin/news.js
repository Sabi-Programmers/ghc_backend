import express from "express";
import { isAuthenticated } from "../../middlewares/auth.js";
import { getNews } from "../../controllers/admin/news.js";

const newsRouter = express.Router();

newsRouter.get("/upload", isAuthenticated, (req, res) => {
  let data = {
    user: req.user,
  };
  return res.render("admin/news/upload-news", {
    title: "Upload News",
    data,
  });
});

newsRouter.get("/", isAuthenticated, getNews);

export default newsRouter;
