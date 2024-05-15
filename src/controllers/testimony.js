import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import response from "../utils/response.js";
import { getUserPackage } from "../services/packageServices.js";
import {
  createTestimonyRequest,
  getAllUserTestimony,
  getUserForTestimonyBonus,
} from "../services/testimonyServices.js";
import { calculatePagination } from "../utils/index.js";

const getAddTestimonyPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };
  res.render("member/testimony/add-testimony", {
    title: "Add Testimony",
    data,
  });
});

const makeTestimonyRequest = asyncWrapper(async (req, res) => {
  const { pkg, facebookLink, youtubeLink, tiktokLink } = req.body;
  const userId = req.user.id;

  if (!facebookLink && !youtubeLink && !tiktokLink) {
    return response.json(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Must provide at least one Link"
    );
  }

  const pkgData = await getUserPackage(userId, pkg);
  const testimonyBonus = await getUserForTestimonyBonus(userId);
  const completedCycle =
    pkgData.currentCycle > 0 ? pkgData.currentCycle - 1 : 0;
  const lastPaidCycle = testimonyBonus[pkg + "Count"];

  if (completedCycle === lastPaidCycle) {
    return response.json(res, StatusCodes.BAD_REQUEST, false, "Not Eligible");
  }

  const testimony = await createTestimonyRequest(
    userId,
    pkg,
    facebookLink,
    tiktokLink,
    youtubeLink,
    completedCycle,
    lastPaidCycle
  );

  return response.json(res, StatusCodes.CREATED, true, "Request Submitted", {
    testimony,
  });
  // try {
  // } catch (error) {
  //   return response.json(
  //     res,
  //     StatusCodes.INTERNAL_SERVER_ERROR,
  //     false,
  //     "Internal Server Error"
  //   );
  // }
});

const getViewTestimonies = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { testimonies, totalItem } = await getAllUserTestimony(
    req.user.id,
    perPage,
    page
  );

  data.testimonies = testimonies;

  data.pagination = calculatePagination(totalItem, page, perPage);

  res.render("member/testimony/veiw-testimony", {
    title: "Veiw Testimonies",
    data,
  });
});

export { getAddTestimonyPage, makeTestimonyRequest, getViewTestimonies };
