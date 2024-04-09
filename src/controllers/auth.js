import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";

const getSponsor = asyncWrapper(async (req, res) => {
  const { sponsorId } = req.query;

  //   console.log(req.body);
  let sponsorUsername = null;
  if (sponsorId) {
    const sponsor = await database.user.findFirst({
      where: { username: sponsorId.toLowerCase() },
    });
    if (sponsor) {
      sponsorUsername = sponsor.username;
    }
  }

  res.render("auth/register", {
    title: "Create an account",
    sponsorUsername,
  });
  // const user = await database.user.create({
  //     data: {
  //         username: username.toLowerCase(),
  //         password: hashedPassword,
  //     },
  // });
  //   res.redirect("/auth/register");
});
const createUser = asyncWrapper(async (req, res) => {
  const {
    username,
    password,
    phone,
    fullName,
    sponsorUsername,
    city,
    country,
    email,
    gender,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await database.user.create({
    data: {
      username: username.toLowerCase(),
      password: hashedPassword,
      phone,
      email: email.toLowerCase(),
      city,
      country,
      sponsorUsername,
      fullName,
      gender,
    },
  });
  res.redirect("/auth/login");
});

export { createUser, getSponsor };
