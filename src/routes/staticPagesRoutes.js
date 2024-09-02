import express from "express";
import { getContants } from "../services/contantsServices.js";
import { getAllPublichedTestimony } from "../services/testimonyServices.js";
import { calculatePagination } from "../utils/index.js";

const staticPagesRouter = express.Router();

staticPagesRouter.get("", async (req, res) => {
  if (req.query.ref) {
    return res.redirect(`/auth/register?sponsorId=${req.query.ref}`);
  }

  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };

  const { testimonies } = await getAllPublichedTestimony(10, 1);

  data.testimonies = testimonies;

  data.prices = await getContants();

  res.render("staticPages/home", { title: "Home", data });
});
staticPagesRouter.get("/about", (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };
  res.render("staticPages/about", { title: "About Us", data });
});
staticPagesRouter.get("/how-it-works", async (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };

  data.prices = await getContants();
  res.render("staticPages/how-it-works", { title: "How it Works", data });
});
staticPagesRouter.get("/contact", (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };
  res.render("staticPages/contact", { title: "Contact Us", data });
});
staticPagesRouter.get("/faq", (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };
  res.render("staticPages/faq", { title: "FAQ", data });
});
staticPagesRouter.get("/testimonials", async (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { testimonies, totalItem } = await getAllPublichedTestimony(
    perPage,
    page
  );

  data.testimonies = testimonies;
  data.pagination = calculatePagination(totalItem, page, perPage);

  res.render("staticPages/testimonials", { title: "Testimonials", data });
});
staticPagesRouter.get("/our-products", (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };
  res.render("staticPages/our-products", { title: "Our Products", data });
});
staticPagesRouter.get("/legal", (req, res) => {
  const data = {
    isAuthenticated: req.isAuthenticated(),
    path: req.path,
  };
  res.render("staticPages/terms-and-cond", { title: "Legal", data });
});

export default staticPagesRouter;
