import express from "express";
import { createAdmin } from "../../controllers/admin/auth.js";
import passport from "passport";
import {
  validateAuth,
  validateLoginAuth,
} from "../../validators/authValidators.js";
import { isAuthenticated } from "../../middlewares/auth.js";
const authRouter = express.Router();

authRouter.get("/login", isAuthenticated, (req, res) => {
  res.render("auth/admin-login", {
    title: "Admin Login",
    data: { error: null },
  });
});

authRouter.post(
  "/login",
  isAuthenticated,
  validateLoginAuth,
  validateAuth,
  passport.authenticate("admin-local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true, // Enable flash messages for authentication failures
  })
);

authRouter.post("/register", isAuthenticated, createAdmin);

authRouter.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/admin/login");
  });
});

export default authRouter;
