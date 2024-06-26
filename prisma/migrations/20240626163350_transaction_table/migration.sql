-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "collectionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "depositorAccountNumber" TEXT NOT NULL,
    "depositorAccountName" TEXT NOT NULL,
    "narration" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "transactionReference" TEXT NOT NULL,
    "originatorBank" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "settlementReference" TEXT NOT NULL,
    "sessionID" TEXT NOT NULL,
    "uniqueIdentifier" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionReference_key" ON "Transactions"("transactionReference");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_settlementReference_key" ON "Transactions"("settlementReference");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_sessionID_key" ON "Transactions"("sessionID");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_uniqueIdentifier_key" ON "Transactions"("uniqueIdentifier");
