import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
import cors from "cors";
import router from "./routes/index.js";

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
app.use(express.static("public"));
// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });

app.use(router);

// app.get("/", (req, res) => {
//   res.render("index");
// });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
