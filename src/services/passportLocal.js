import passport from "passport";
import LocalStrategy from "passport-local/lib/strategy.js";
import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";

// Passport local strategy for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      const user = await database.user.findFirst({
        where: {
          OR: [
            { username: username.toLowerCase() },
            { email: username.toLowerCase() },
          ],
        },
      });
      if (!user) {
        return done(null, false, {
          message: "Username or Email does't match Password",
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: "Username or Email does't match Password",
        });
      }
      return done(null, user);
    }
  )
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
