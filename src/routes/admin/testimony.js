import express from "express";
import {
  acceptTestimony,
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
testmonyRouter.get("/:userId/accept/:id", acceptTestimony);

export default testmonyRouter;
