import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
import cors from "cors";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(xss());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Welcome to Grand Health Care API");
});

const port = "8080";
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
