import express from "express";
import { isUnauthenticated } from "../../middlewares/auth.js";
import { createAdmin } from "../../controllers/admin/auth.js";
import passport from "passport";
import {
  validateAuth,
  validateLoginAuth,
} from "../../validators/authValidators.js";
const authRouter = express.Router();

authRouter.get("/login", isUnauthenticated, (req, res) => {
  res.render("auth/admin-login", {
    title: "Admin Login",
    data: { error: null },
  });
});

authRouter.post(
  "/login",
  isUnauthenticated,
  validateLoginAuth,
  validateAuth,
  passport.authenticate("admin-local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true, // Enable flash messages for authentication failures
  })
);

authRouter.post("/register", isUnauthenticated, createAdmin);

authRouter.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/admin/login");
  });
});

export default authRouter;
