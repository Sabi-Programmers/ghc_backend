import express from "express";
import { isAuthenticated } from "../../middlewares/auth.js";
import { createNews, getANews, getNews } from "../../controllers/admin/news.js";
import { uploadImage } from "../../middlewares/upload.js";

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

newsRouter.post("/upload", uploadImage.single("photo"), createNews);
newsRouter.get("/", isAuthenticated, getNews);
newsRouter.get("/:slug", isAuthenticated, getANews);

export default newsRouter;
