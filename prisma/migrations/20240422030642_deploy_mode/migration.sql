-- CreateEnum
CREATE TYPE "Genders" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sponsorUsername" TEXT NOT NULL DEFAULT 'GHC',
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Genders" NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "hasFunded" BOOLEAN NOT NULL DEFAULT false,
    "displayPhoto" TEXT,
    "bankName" TEXT,
    "accountNumber" BIGINT,
    "accountName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ewallet" (
    "id" SERIAL NOT NULL,
    "virtualBankName" TEXT NOT NULL,
    "accountNumber" BIGINT NOT NULL,
    "accountName" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Ewallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderCycleBonus" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LeaderCycleBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalWallet" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "leaderCycle" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "salesIncome" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WithdrawalWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesIncomeBonus" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SalesIncomeBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferrerIncome" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ReferrerIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CycleWelcomeBonus" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CycleWelcomeBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonyBonus" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "bronzeCount" INTEGER NOT NULL DEFAULT 0,
    "goldCount" INTEGER NOT NULL DEFAULT 0,
    "diamondCount" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TestimonyBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionBonus" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CompletionBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnclaimedRewards" (
    "id" SERIAL NOT NULL,
    "bronze" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "bronzeLostCount" INTEGER NOT NULL DEFAULT 0,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "goldLostCount" INTEGER NOT NULL DEFAULT 0,
    "diamond" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamondLostCount" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UnclaimedRewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountNumber_key" ON "User"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ewallet_userId_key" ON "Ewallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderCycleBonus_userId_key" ON "LeaderCycleBonus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalWallet_userId_key" ON "WithdrawalWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesIncomeBonus_userId_key" ON "SalesIncomeBonus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerIncome_userId_key" ON "ReferrerIncome"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CycleWelcomeBonus_userId_key" ON "CycleWelcomeBonus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonyBonus_userId_key" ON "TestimonyBonus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionBonus_userId_key" ON "CompletionBonus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UnclaimedRewards_userId_key" ON "UnclaimedRewards"("userId");

-- AddForeignKey
ALTER TABLE "Ewallet" ADD CONSTRAINT "Ewallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderCycleBonus" ADD CONSTRAINT "LeaderCycleBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalWallet" ADD CONSTRAINT "WithdrawalWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesIncomeBonus" ADD CONSTRAINT "SalesIncomeBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferrerIncome" ADD CONSTRAINT "ReferrerIncome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleWelcomeBonus" ADD CONSTRAINT "CycleWelcomeBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonyBonus" ADD CONSTRAINT "TestimonyBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionBonus" ADD CONSTRAINT "CompletionBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnclaimedRewards" ADD CONSTRAINT "UnclaimedRewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
