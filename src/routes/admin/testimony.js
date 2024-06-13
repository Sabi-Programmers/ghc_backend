import express from "express";
import { getPendingTestimoniesPage } from "../../controllers/admin/testimony.js";

const testmonyRouter = express.Router();

testmonyRouter.get("/", getPendingTestimoniesPage);

export default testmonyRouter;
