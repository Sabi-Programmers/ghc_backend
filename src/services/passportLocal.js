import passport from "passport";
import LocalStrategy from "passport-local/lib/strategy.js";
import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";

// Passport local strategy for authentication
passport.use(
  "member-local",
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
passport.use(
  "admin-local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      const admin = await database.admin.findFirst({
        where: {
          OR: [
            { username: username.toLowerCase() },
            { email: username.toLowerCase() },
          ],
        },
      });
      if (!admin) {
        return done(null, false, {
          message: "Username or Email does't match Password",
        });
      }
      if (!bcrypt.compareSync(password, admin.password)) {
        return done(null, false, {
          message: "Username or Email does't match Password",
        });
      }
      return done(null, admin);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async ({ id, role }, done) => {
  if (role === "MEMBER") {
    const user = await database.user.findFirst({
      where: { id },
    });
    done(null, user);
  } else if (role === "ADMIN") {
    const admin = await database.admin.findFirst({
      where: { id },
    });

    done(null, admin);
  } else {
    done({ message: "No entity found" }, null);
  }
});
