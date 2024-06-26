import express from "express";
import {
  getPendingTestimoniesPage,
  getTestimonyRecordsPage,
  getUserPendingTestimoniesPage,
  rejectTestimony,
} from "../../controllers/admin/testimony.js";

const testmonyRouter = express.Router();

testmonyRouter.get("/", getPendingTestimoniesPage);
testmonyRouter.get("/records", getTestimonyRecordsPage);
testmonyRouter.get("/:userId", getUserPendingTestimoniesPage);
testmonyRouter.post("/:userId/reject/:id", rejectTestimony);

export default testmonyRouter;
