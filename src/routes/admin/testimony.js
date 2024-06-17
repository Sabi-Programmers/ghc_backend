import express from "express";
import {
  getPendingTestimoniesPage,
  getUserPendingTestimoniesPage,
} from "../../controllers/admin/testimony.js";

const testmonyRouter = express.Router();

testmonyRouter.get("/", getPendingTestimoniesPage);
testmonyRouter.get("/:userId", getUserPendingTestimoniesPage);

export default testmonyRouter;
