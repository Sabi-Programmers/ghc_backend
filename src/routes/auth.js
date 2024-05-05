import express from "express";
import passport from "passport";
import { createUser, getSponsor } from "../controllers/auth.js";
import {
  validateAuth,
  validateCreateUserAuth,
  validateLoginAuth,
} from "../validators/authValidators.js";
import { isAuthenticated } from "../middlewares/auth.js";
const authRouter = express.Router();

authRouter.get("/register", isAuthenticated, getSponsor);
authRouter.post(
  "/register",
  isAuthenticated,
  validateCreateUserAuth,
  validateAuth,
  createUser
);
authRouter.get("/login", isAuthenticated, (req, res) => {
  res.render("auth/login", { title: "Login", data: { error: null } });
});
authRouter.post(
  "/login",
  isAuthenticated,
  validateLoginAuth,
  validateAuth,
  passport.authenticate("member-local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true, // Enable flash messages for authentication failures
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
