import express from "express";
import {
  getMembers,
  getMembersOrders,
} from "../../controllers/admin/members.js";

const memberRouter = express.Router();

memberRouter.get("", getMembers);
memberRouter.get("/orders", getMembersOrders);

export default memberRouter;
