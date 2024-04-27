import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectFlash from "connect-flash";
import { createPool } from "mysql2/promise";
import mySqlSession from "express-mysql-session";
import router from "./routes/index.js";
import notFound from "./errors/notFound.js";
import errorHandler from "./errors/errorHandler.js";
import "./services/passportLocal.js";

dotenv.config();
const app = express();

// Setup Veiw Engine
app.set("view engine", "ejs");

// Set the views directory (where EJS templates are located)
app.set("views", "src/views");

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(xss());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handling session
const pool = createPool({
  host: "127.0.0.1", // Replace with your MySQL host
  user: "root", // Replace with your MySQL username
  password: "", // Replace with your MySQL password
  database: "mvc_db", // Replace with your MySQL database name
});

const MySQLStore = mySqlSession(session);
const sessionStore = new MySQLStore(
  {
    checkExpirationInterval: 15 * 60 * 1000, // Check for expired sessions every 15 minutes
    expiration: 86400000, // Session expires after 24 hours (adjust as needed)
    createDatabaseTable: true, // Create the sessions table if it doesn't exist
  },
  pool
);
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
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

app.use(router);

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
