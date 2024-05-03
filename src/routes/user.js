import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/:username", isAuthenticated, (req, res) => {
  res.send("USers");
});

export default userRouter;
