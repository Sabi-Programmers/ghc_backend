import express from "express";
import {
  getAddTestimonyPage,
  getViewTestimonies,
  makeTestimonyRequest,
} from "../controllers/testimony.js";

const testimonyRouter = express.Router();

testimonyRouter.get("/", getAddTestimonyPage);
testimonyRouter.post("/", makeTestimonyRequest);
testimonyRouter.get("/view", getViewTestimonies);

export default testimonyRouter;
