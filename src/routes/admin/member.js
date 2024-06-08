import express from "express";
import {
  blockMember,
  getBlockMemberPage,
  getBlockedMembersPage,
  getMembers,
  getMembersOrders,
  getRollBackFundsPage,
  rollBackFunds,
  searchMember,
} from "../../controllers/admin/members.js";

const memberRouter = express.Router();

memberRouter.get("", getMembers);
memberRouter.get("/search", searchMember);
memberRouter.get("/orders", getMembersOrders);
memberRouter.get("/block", getBlockMemberPage);
memberRouter.post("/block", blockMember);
memberRouter.get("/blocked", getBlockedMembersPage);
memberRouter.get("/rollback-funds", getRollBackFundsPage);
memberRouter.post("/rollback-funds", rollBackFunds);

export default memberRouter;
