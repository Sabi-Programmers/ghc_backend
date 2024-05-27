import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { getAllPublishedNews } from "../services/newsServies.js";

import response from "../utils/response.js";

const getNews = asyncWrapper(async (req, res) => {
  const news = await getAllPublishedNews();

  return response.json(
    res,
    StatusCodes.OK,
    true,
    "Get all Published News",
    news
  );
});

export { getNews };
