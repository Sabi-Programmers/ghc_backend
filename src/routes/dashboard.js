import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
const dashboardRouter = express.Router();

dashboardRouter.get("", isAuthenticated, (req, res) => {
  const user = req.user;
  const data = {
    user,
  };
  res.render("member/dashboard", { title: "Dashboard", data: data });
});

export default dashboardRouter;
