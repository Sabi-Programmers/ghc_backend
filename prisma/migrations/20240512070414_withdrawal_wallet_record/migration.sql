/*
  Warnings:

  - You are about to drop the `BonusWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('cycle_welcome', 'testimony', 'referral', 'completion', 'cycle_leader', 'sales_income');

-- DropForeignKey
ALTER TABLE "BonusWallet" DROP CONSTRAINT "BonusWallet_userId_fkey";

-- DropTable
DROP TABLE "BonusWallet";

-- CreateTable
CREATE TABLE "WithdrawalWalletRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "usernames" TEXT,
    "downlineName" TEXT,
    "sponsorUsername" TEXT,
    "generation" TEXT,
    "salesAgent" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "cycle" INTEGER,
    "incomeType" "IncomeType" NOT NULL,
    "package" "PackageType",
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithdrawalWalletRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WithdrawalWalletRecord" ADD CONSTRAINT "WithdrawalWalletRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
