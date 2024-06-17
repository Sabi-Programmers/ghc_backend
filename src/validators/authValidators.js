import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import response from "../utils/response.js";

const validateCreateUserAuth = [
  body("sponsorUsername").exists().withMessage("sponspor username is required"),
  body("sponsorId").exists().withMessage("sponspor Id is required"),
  body("fullName").exists().withMessage("name is required"),
  body("accountNumber").exists().withMessage("Account Number is required"),
  body("accountFName").exists().withMessage("Account First Name is required"),
  body("accountLName").exists().withMessage("Account Last Name is required"),
  body("bankName").exists().withMessage("Bank Name is required"),
  body("bankCode").exists().withMessage("Bank Code is required"),

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
  body("city").exists().withMessage("City is required"),
  body("phone").exists().withMessage("Phone is required"),

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
const validateResetPassword = [
  body("username").exists().withMessage("Username or Email is required"),
  body("token")
    .exists()
    .withMessage("OTP is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Invaild OTP")
    .isLength({ max: 6 })
    .withMessage("Invaild OTP"),

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

const validateChangePassword = [
  body("oldPassword")
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
const validateUpdateProfile = [
  body("fullName").exists().withMessage("Full Name is required"),
  body("phone").exists().withMessage("Phone is required"),
  body("city").exists().withMessage("City is required"),
  body("country").exists().withMessage("Country is required"),
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
  body("accountName").exists().withMessage("Account Name is required"),
  body("accountNumber").exists().withMessage("Account Number is required"),
  body("bankName").exists().withMessage("Bank Name is required"),
];

const validateAuth = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Invalid Request",
      errors
    );
  }
  return next();
};

export {
  validateLoginAuth,
  validateCreateUserAuth,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile,
  validateAuth,
};
