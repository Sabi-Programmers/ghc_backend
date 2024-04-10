import express from "express";
const dashboardRouter = express.Router();

dashboardRouter.get("", (req, res) => {
  res.render("member/dashboard", { title: "Dashboard" });
});

export default dashboardRouter;
