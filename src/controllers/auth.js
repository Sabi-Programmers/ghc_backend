import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import passport from "passport";
import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createEWallet } from "../services/eWalletServices.js";
import response from "../utils/response.js";

const getRegisterPage = asyncWrapper(async (req, res) => {
  const { sponsorId } = req.query;

  let sponsorUsername = null;
  let sponsorID = 0;
  let error = null;
  if (sponsorId) {
    if (sponsorId === "GHC") {
      sponsorUsername = sponsorId;
    } else {
      const sponsor = await database.user.findFirst({
        where: { username: sponsorId.toLowerCase() },
      });
      if (sponsor) {
        sponsorUsername = sponsor.username;
        sponsorID = sponsor.id;
      } else {
        error = "Could not find Sponsor";
      }
    }
  }

  res.render("auth/register", {
    title: "Create an account",
    data: { sponsorUsername, sponsorID, error },
  });
});
const createUser = asyncWrapper(async (req, res) => {
  const {
    username,
    password,
    phone,
    fullName,
    sponsorUsername,
    sponsorId,
    city,
    country,
    email,
    gender,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await database.user.create({
      data: {
        username: username.toLowerCase(),
        password: hashedPassword,
        phone,
        email: email.toLowerCase(),
        city,
        country,
        sponsorUsername,
        sponsorId: Number(sponsorId),
        fullName,
        gender,
      },
    });

    await createEWallet(user);
    return response.json(
      res,
      StatusCodes.CREATED,
      true,
      "Account created Successfully"
    );
  } catch (err) {
    let error = "something went wrong";

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        if (err.meta.target.includes("username")) {
          error = "Username already exists";
        } else if (err.meta.target.includes("email")) {
          error = "Email already exists";
        } else if (err.meta.target.includes("phone")) {
          error = "Phone Number already exists";
        } else {
          error = err.meta.target;
        }
      }
    }

    return response.json(res, StatusCodes.BAD_REQUEST, false, error);
  }
});
const getLoginPage = asyncWrapper(async (req, res) => {
  return res.render("auth/login", { title: "Login", data: { error: null } });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  passport.authenticate("member-local", (err, user, info) => {
    if (err) {
      return response.json(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal Server Error"
      );
    }
    if (!user) {
      return response.json(res, StatusCodes.UNAUTHORIZED, false, info.message);
    }

    req.logIn(user, (err) => {
      if (err) {
        return response.json(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "Internal Server Error"
        );
      }

      // If authentication was successful, send a success response
      return response.json(res, StatusCodes.OK, true, "Login successful");
    });
  })(req, res, next);
});

const logoutUser = asyncWrapper(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return response.json(res, StatusCodes.OK, true, "Logout successful");
    });
  });
});

export { createUser, getRegisterPage, getLoginPage, loginUser, logoutUser };
