import express from "express";
const dashboardRouter = express.Router();

const middlewares = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};

dashboardRouter.get("", middlewares, (req, res) => {
  const user = req.user;
  const data = {
    user,
  };
  res.render("member/dashboard", { title: "Dashboard", data: data });
});

export default dashboardRouter;
