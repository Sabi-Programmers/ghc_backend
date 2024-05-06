import express from "express";
import { getAddTestimonyPage } from "../controllers/testimony.js";

const testimonyRouter = express.Router();

testimonyRouter.get("/", getAddTestimonyPage);

export default testimonyRouter;
