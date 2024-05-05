import express from "express";
import { isAuthenticated } from "../../middlewares/auth.js";
import {
  createNews,
  deleteNews,
  getANews,
  getNews,
  getUploadNews,
} from "../../controllers/admin/news.js";
import { uploadImage } from "../../middlewares/upload.js";

const newsRouter = express.Router();

newsRouter.get("/upload", isAuthenticated, getUploadNews);

newsRouter.post("/upload", uploadImage.single("photo"), createNews);
newsRouter.get("/", isAuthenticated, getNews);
newsRouter.get("/:slug", isAuthenticated, getANews);
newsRouter.delete("/:id", isAuthenticated, deleteNews);

export default newsRouter;
