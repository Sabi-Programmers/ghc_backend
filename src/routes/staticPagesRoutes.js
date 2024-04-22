import express from "express";
const staticPagesRouter = express.Router();

staticPagesRouter.get("", (req, res) => {
  if (req.query.ref) {
    return res.redirect("/auth/register?sponsorId=" + req.query.ref);
  }

  res.render("staticPages/home", { title: "Home" });
});
staticPagesRouter.get("/about", (req, res) => {
  res.render("staticPages/about", { title: "About Us" });
});
staticPagesRouter.get("/how-it-works", (req, res) => {
  res.render("staticPages/how-it-works", { title: "How it Works" });
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

export default staticPagesRouter;
