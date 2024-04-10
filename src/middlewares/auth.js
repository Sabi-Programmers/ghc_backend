import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/CustomError.js";

const isUnauthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  throw new CustomError(
    "You are not authorized to access this resource",
    StatusCodes.UNAUTHORIZED,
    "Unauthorized"
  );
};

export { isAdmin, isUnauthenticated, isAuthenticated };
