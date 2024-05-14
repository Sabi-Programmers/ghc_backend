import express from "express";
import {
  getAddTestimonyPage,
  makeTestimonyRequest,
} from "../controllers/testimony.js";

const testimonyRouter = express.Router();

testimonyRouter.get("/", getAddTestimonyPage);
testimonyRouter.post("/", makeTestimonyRequest);

export default testimonyRouter;
