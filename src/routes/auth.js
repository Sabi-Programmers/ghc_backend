import express from "express";
import passport from "passport";
import { createUser, getSponsor } from "../controllers/auth.js";
import {
  validateAuth,
  validateLoginAuth,
} from "../validators/authValidators.js";
const authRouter = express.Router();

const middlewares = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

authRouter.get("/register", middlewares, getSponsor);
authRouter.post("/register", createUser);
authRouter.get("/login", middlewares, (req, res) => {
  res.render("auth/login", { title: "Login" });
});
authRouter.post(
  "/login",
  validateLoginAuth,
  validateAuth,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

export default authRouter;
