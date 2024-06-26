import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import response from "../utils/response.js";
import database from "../libs/prisma.js";
const getTransactionNotification = asyncWrapper(async (req, res) => {
  try {
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

    // Check for existing records with the same SettlementReference, TransactionReference, or SessionID
    const existingTransaction = await database.transactions.findFirst({
      where: {
        OR: [
          { settlementReference: SettlementReference },
          { transactionReference: TransactionReference },
          { sessionID: SessionID },
        ],
      },
    });

    if (existingTransaction) {
      return response.json(
        res,
        StatusCodes.CONFLICT,
        false,
        "Duplicate transaction detected. This transaction has already been processed."
      );
    }

    // Create the new transaction
    const trx = await database.transactions.create({
      data: {
        collectionType: CollectionType,
        amount: Amount,
        depositorAccountNumber: DepositorAccountNumber,
        depositorAccountName: DepositorAccountName,
        narration: Narration,
        channel: Channel,
        dateTime: new Date(DateTime),
        accountNumber: AccountNumber,
        accountName: AccountName,
        transactionReference: TransactionReference,
        originatorBank: OriginatorBank,
        description: Description,
        settlementReference: SettlementReference,
        sessionID: SessionID,
        uniqueIdentifier: UniqueIdentifier,
      },
    });

    const user = await database.user.findUnique({
      where: { email: trx.uniqueIdentifier },
      include: {
        eWallet: true,
      },
    });

    if (user && user.hasFunded) {
      await database.ewallet.update({
        where: { userId: user.id },
        data: {
          balance: parseFloat((user.eWallet.balance + trx.amount).toFixed(2)),
        },
      });
    } else {
      await database.user.update({
        where: { id: user.id },
        data: {
          hasFunded: true,
          eWallet: {
            update: {
              balance: parseFloat(
                (user.eWallet.balance + trx.amount).toFixed(2)
              ),
            },
          },
        },
        include: {
          eWallet: true,
        },
      });
    }

    return response.json(
      res,
      StatusCodes.OK,
      true,
      "Transaction Notifications Received"
    );
  } catch (error) {
    console.log(error);
    return response.json(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      error.message
    );
  }
});

export { getTransactionNotification };
