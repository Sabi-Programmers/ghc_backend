import express from "express";
import { getANews, getNews } from "../controllers/news.js";

const newsRouter = express.Router();

newsRouter.get("/", getNews);
newsRouter.get("/:slug", getANews);

export default newsRouter;
