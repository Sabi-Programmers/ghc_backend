import express from "express";

const newsRouter = express.Router();

newsRouter.get("/upload", (req, res) => {
  let data = {
    user: req.user,
  };
  return res.render("admin/news/upload-news", {
    title: "Upload News",
    data,
  });
});

export default newsRouter;
