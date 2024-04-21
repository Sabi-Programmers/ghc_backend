import express from "express";
import passport from "passport";
import { createUser, getSponsor } from "../controllers/auth.js";
import {
  validateAuth,
  validateCreateUserAuth,
  validateLoginAuth,
} from "../validators/authValidators.js";
import { isUnauthenticated } from "../middlewares/auth.js";
const authRouter = express.Router();

authRouter.get("/register", isUnauthenticated, getSponsor);
authRouter.post(
  "/register",
  isUnauthenticated,
  validateCreateUserAuth,
  validateAuth,
  createUser
);
authRouter.get("/login", isUnauthenticated, (req, res) => {
  res.render("auth/login", { title: "Login", data: { error: null } });
});
authRouter.post(
  "/login",
  isUnauthenticated,
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
