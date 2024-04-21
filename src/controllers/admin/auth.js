import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import database from "../../libs/prisma.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";

const createAdmin = asyncWrapper(async (req, res, next) => {
  const { username, password, email, isSuperAdmin } = req.body;

  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await database.admin.create({
      data: {
        username: username.toLowerCase(),
        password: hashedPassword,
        email: email.toLowerCase(),
      },
    });

    res.redirect("/admin/login");
  } catch (err) {
    console.log(err);
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
    return res.send(error);

    //   return res.render("auth/register", {
    //     title: "Create an Ad",
    //     data: { sponsorUsername, error },
    //   });
  }
});

export { createAdmin };
