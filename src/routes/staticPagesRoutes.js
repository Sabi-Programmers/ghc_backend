import express from "express";
import { getContants } from "../services/contantsServices.js";
const staticPagesRouter = express.Router();

staticPagesRouter.get("", async (req, res) => {
  if (req.query.ref) {
    return res.redirect("/auth/register?sponsorId=" + req.query.ref);
  }

  const data = {};

  data.prices = await getContants();

  res.render("staticPages/home", { title: "Home", data });
});
staticPagesRouter.get("/about", (req, res) => {
  res.render("staticPages/about", { title: "About Us" });
});
staticPagesRouter.get("/how-it-works", async (req, res) => {
  const data = {};

  data.prices = await getContants();
  res.render("staticPages/how-it-works", { title: "How it Works", data });
});
staticPagesRouter.get("/contact", (req, res) => {
  res.render("staticPages/contact", { title: "Contact Us" });
});
staticPagesRouter.get("/faq", (req, res) => {
  res.render("staticPages/faq", { title: "FAQ" });
});
staticPagesRouter.get("/testimonials", (req, res) => {
  res.render("staticPages/testimonials", { title: "Testimonials" });
});
staticPagesRouter.get("/our-products", (req, res) => {
  res.render("staticPages/our-products", { title: "Our Products" });
});
staticPagesRouter.get("/legal", (req, res) => {
  res.render("staticPages/terms-and-cond", { title: "Legal" });
});

export default staticPagesRouter;
