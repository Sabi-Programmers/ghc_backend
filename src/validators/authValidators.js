import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/CustomError.js";

const validateCreateUserAuth = [
  body("sponsorUsername").exists().withMessage("sponspor username is required"),
  body("fullName").exists().withMessage("name is required"),

  body("username")
    .exists()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long"),

  body("gender")
    .exists()
    .withMessage("Gender is required")
    .custom((value) => {
      if (!["male", "female"].includes(value)) {
        throw new Error("Gender must be male or female");
      }
      return true;
    }),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("country").exists().withMessage("Country is required"),
  body("city").exists().withMessage("Country is required"),
  body("phone").exists().withMessage("Country is required"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value) => {
      // Check if the password contains at least one uppercase letter
      if (!/[A-Z]/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter");
      }

      // Check if the password contains at least one lowercase letter
      if (!/[a-z]/.test(value)) {
        throw new Error("Password must contain at least one lowercase letter");
      }

      return true;
    }),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
const validateLoginAuth = [
  body("username")
    .exists()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value) => {
      // Check if the password contains at least one uppercase letter
      if (!/[A-Z]/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter");
      }

      // Check if the password contains at least one lowercase letter
      if (!/[a-z]/.test(value)) {
        throw new Error("Password must contain at least one lowercase letter");
      }

      return true;
    }),
];

const validateAuth = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    throw new CustomError(
      "You are seeing this page because of you made an invalid request",
      StatusCodes.BAD_REQUEST,
      "Invalid Request"
    );
  }
  return next();
};

export { validateLoginAuth, validateCreateUserAuth, validateAuth };
