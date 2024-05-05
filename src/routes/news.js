import express from "express";
import { getANews, getNews } from "../controllers/news.js";
import { isAuthenticated } from "../middlewares/auth.js";

const newsRouter = express.Router();

newsRouter.get("/", isAuthenticated, getNews);
newsRouter.get("/:slug", isAuthenticated, getANews);

export default newsRouter;
