import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import {
  getAllTestimony,
  getAllUserTestimony,
  rejectUserTestimony,
} from "../../services/testimonyServices.js";
import userServices from "../../services/userServices.js";
import { calculatePagination } from "../../utils/index.js";
import response from "../../utils/response.js";

const getTestimonyRecordsPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const searchQuery = req.query.q || null;
  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { testimonies, totalItem } = await getAllTestimony(
    page,
    perPage,
    searchQuery,
    "APPROVED"
  );

  data.testimonies = testimonies;
  data.q = searchQuery;

  data.pagination = calculatePagination(totalItem, page, perPage);

  res.render("admin/testimony/records", {
    title: "Testimony Records",
    data,
  });
});

const getPendingTestimoniesPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const searchQuery = req.query.q || null;
  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { testimonies, totalItem } = await getAllTestimony(
    page,
    perPage,
    searchQuery,
    "PENDING"
  );

  data.testimonies = testimonies;
  data.q = searchQuery;

  data.pagination = calculatePagination(totalItem, page, perPage);

  res.render("admin/testimony/pending", {
    title: "Pending Testimonies",
    data,
  });
});
const getUserPendingTestimoniesPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const userId = req.params.userId;

  const members = await userServices.getSingleUser(userId);

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { testimonies, totalItem } = await getAllUserTestimony(
    userId,
    perPage,
    page
  );

  data.testimonies = testimonies;

  data.pagination = calculatePagination(totalItem, page, perPage);

  res.render("admin/testimony/members-testimony", {
    title: members.username + "'s Testimonies",
    data,
  });
});

const rejectTestimony = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const feedbackMessage = req.body.feedbackMessage;
  await rejectUserTestimony(userId, id, feedbackMessage);

  return response.json(res, StatusCodes.OK, true, "Testimony rejected");
});

export {
  getTestimonyRecordsPage,
  getPendingTestimoniesPage,
  getUserPendingTestimoniesPage,
  rejectTestimony,
};
