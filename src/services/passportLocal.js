import passport from "passport";
import LocalStrategy from "passport-local/lib/strategy.js";
import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";

// Passport local strategy for authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await database.user.findFirst({
      where: { username: username.toLowerCase() },
    });
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await database.user.findFirst({
    where: { id },
  });
  done(null, user);
});
