import express from "express";
const authRouter = express.Router();

authRouter.get("/register", (req, res) => {
  res.render("auth/register", { title: "Create an account" });
});
authRouter.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

export default authRouter;
