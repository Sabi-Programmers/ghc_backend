import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import response from "../utils/response.js";

const getTransactionNotifcation = asyncWrapper(async (req, res) => {
  const {
    CollectionType,
    Amount,
    DepositorAccountNumber,
    DepositorAccountName,
    Narration,
    Channel,
    DateTime,
    AccountNumber,
    AccountName,
    TransactionReference,
    OriginatorBank,
    Description,
    SettlementReference,
    SessionID,
    UniqueIdentifier,
  } = req.body;
  console.log(req.body);
  return response.json(
    res,
    StatusCodes.OK,
    true,
    "Transaction Notifications Received"
  );
});

export { getTransactionNotifcation };
