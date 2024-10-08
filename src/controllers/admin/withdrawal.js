import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import {
  approveUserRequest,
  getAllWithdrawalRequests,
  rejectUserRequest,
} from "../../services/withdrawalWalletServices.js";
import { calculatePagination } from "../../utils/index.js";
import response from "../../utils/response.js";

const getWithdrawalRequestPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const searchQuery = req.query.q || null;
  const wallet = req.query.wt || "bronze";
  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { requests, totalItems } = await getAllWithdrawalRequests(
    page,
    perPage,
    wallet,
    false
  );

  data.q = searchQuery;

  // console.log(requests[0].User.withdrawalWallet);
  data.requests = requests;
  data.pagination = calculatePagination(totalItems, page, perPage);
  data.wallet = wallet;

  res.render("admin/withdrawals/request", {
    title: "Withdrawal Requests",
    data,
  });
});
const getWithdrawalHistoryPage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const searchQuery = req.query.q || null;
  const wallet = req.query.wt || "bronze";
  const page = Number(req.query.page) || 1; // Current page
  const perPage = Number(req.query.limit) || 10; // Number of records per page

  const { requests, totalItems } = await getAllWithdrawalRequests(
    page,
    perPage,
    wallet,
    true
  );

  data.q = searchQuery;

  // console.log(requests[0].User.withdrawalWallet);
  data.requests = requests;
  data.pagination = calculatePagination(totalItems, page, perPage);
  data.wallet = wallet;

  res.render("admin/withdrawals/history", {
    title: "Withdrawal History",
    data,
  });
});
const approveWithdrawalRequest = asyncWrapper(async (req, res) => {
  await approveUserRequest(req.params.id);
  return response.json(
    res,
    StatusCodes.OK,
    true,
    "withdrawal Payment successful"
  );
});

const rejectWithdrawalRequest = asyncWrapper(async (req, res) => {
  await rejectUserRequest(req.params.id, req.body.message);
  return response.json(
    res,
    StatusCodes.OK,
    true,
    "withdrawal Request Rejected"
  );
});

export {
  getWithdrawalRequestPage,
  getWithdrawalHistoryPage,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
};
