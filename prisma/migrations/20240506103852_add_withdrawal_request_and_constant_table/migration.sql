-- CreateEnum
CREATE TYPE "WithdrawalRequestStatus" AS ENUM ('APPROVED', 'DENIED', 'PENDING');

-- CreateEnum
CREATE TYPE "WithdrawalRequestWallets" AS ENUM ('DIAMOND', 'BRONZE', 'GOLD', 'LEADERCYCLE', 'SALESINCOME');

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "WithdrawalRequestStatus" NOT NULL DEFAULT 'PENDING',
    "wallets" "WithdrawalRequestWallets" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contants" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "bronze" DOUBLE PRECISION NOT NULL,
    "gold" DOUBLE PRECISION NOT NULL,
    "diamond" DOUBLE PRECISION NOT NULL,
    "bronzeRefBonus" DOUBLE PRECISION NOT NULL,
    "goldRefBonus" DOUBLE PRECISION NOT NULL,
    "diamondRefBonus" DOUBLE PRECISION NOT NULL,
    "bronzeThreshold" DOUBLE PRECISION NOT NULL,
    "goldThreshold" DOUBLE PRECISION NOT NULL,
    "diamondThreshold" DOUBLE PRECISION NOT NULL,
    "leaderCycleThreshold" DOUBLE PRECISION NOT NULL,
    "salesIncomeThreshold" DOUBLE PRECISION NOT NULL,
    "usdRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contants_pkey" PRIMARY KEY ("id")
);
