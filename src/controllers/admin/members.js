import asyncWrapper from "../../middlewares/asyncWrapper.js";
import userServices from "../../services/userServices.js";
import { calculatePagination } from "../../utils/index.js";

const getMembers = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };

  const searchQuery = req.query.q || null;
  const membersStatus = req.query.st || "all";

  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { members, totalMembers } = await userServices.getAllUsers({
    page,
    perPage,
    membersStatus,
    searchQuery,
  });

  data.q = searchQuery;
  data.st = membersStatus;
  data.members = members;
  data.pagination = calculatePagination(totalMembers, page, perPage);

  res.render("admin/members/members", {
    title: "All Members",
    data,
  });
});

const getMembersOrders = asyncWrapper(async (req, res) => {
  let data = {
    user: req.user,
  };
  res.render("admin/members/members", {
    title: "All Orders",
    data,
  });
});

export { getMembers, getMembersOrders };
