import express from "express";
import passport from "passport";
import { createUser, getSponsor } from "../controllers/auth.js";
import {
  validateAuth,
  validateCreateUserAuth,
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
authRouter.post("/register", validateCreateUserAuth, validateAuth, createUser);
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
authRouter.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default authRouter;
