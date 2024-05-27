import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectFlash from "connect-flash";
import pg from "pg";
import pgSession from "connect-pg-simple";
import router from "./routes/index.js";
import notFound from "./errors/notFound.js";
import errorHandler from "./errors/errorHandler.js";
import "./services/passportLocal.js";

dotenv.config();
const app = express();

const { DATABASE_URL, PORT, DEVELOPMENT } = process.env;

// Setup Veiw Engine
app.set("view engine", "ejs");

// Set the views directory (where EJS templates are located)
app.set("views", "src/views");

// app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(xss());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session

const { Pool } = pg;
const pgSessionInstance = pgSession(session);

const pool = new Pool({
  connectionString: DEVELOPMENT ? DATABASE_URL + "?ssl=true" : DATABASE_URL,
});
app.use(
  session({
    store: new pgSessionInstance({
      pool: pool,
      tableName: "Sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/static", express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(router);

app.use(errorHandler);
app.use(notFound);

const port = PORT;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
