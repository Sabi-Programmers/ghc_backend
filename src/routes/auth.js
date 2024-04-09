import express from "express";
import { createUser, getSponsor } from "../controllers/auth.js";
const authRouter = express.Router();

authRouter.get("/register", getSponsor);
authRouter.post("/register", createUser);
authRouter.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

export default authRouter;
