-- CreateEnum
CREATE TYPE "Genders" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('DIGITAL', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('DIAMOND', 'GOLD', 'BRONZE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'DELIVERED');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('cycle_welcome', 'testimony', 'referral', 'completion', 'cycle_leader', 'sales_income');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'DENIED', 'PENDING');

-- CreateEnum
CREATE TYPE "WithdrawalRequestWallets" AS ENUM ('DIAMOND', 'BRONZE', 'GOLD', 'LEADERCYCLE', 'SALESINCOME');

-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('NOT_PAID', 'PENDING', 'DELIVERED', 'PAYMENT_FAILED');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('ADMIN', 'USER');

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
    "sponsorId" INTEGER NOT NULL DEFAULT 0,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Genders" NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "hasFunded" BOOLEAN NOT NULL DEFAULT false,
    "isCycleLeader" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "displayPhoto" TEXT,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL DEFAULT '',
    "accountFName" TEXT,
    "accountLName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ewallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Ewallet_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "productType" "ProductType" NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesIncomeBonus" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "agent" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesIncomeBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CycleLeaderBonus" (
    "id" SERIAL NOT NULL,
    "downlineName" TEXT NOT NULL,
    "downlineUsername" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "sponsorUsername" TEXT NOT NULL,
    "generation" TEXT NOT NULL,
    "package" "PackageType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CycleLeaderBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferrerIncome" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "package" "PackageType" NOT NULL,
    "cycle" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferrerIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CycleWelcomeBonus" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "package" "PackageType" NOT NULL,
    "cycle" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
CREATE TABLE "TestimonyRecords" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "package" "PackageType" NOT NULL,
    "completedCycles" INTEGER NOT NULL DEFAULT 0,
    "lastPaidCycles" INTEGER NOT NULL DEFAULT 0,
    "facebookLink" TEXT,
    "youtubeLink" TEXT,
    "tiktokLink" TEXT,
    "message" TEXT,
    "feedbackMessage" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestimonyRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionBonus" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "package" "PackageType" NOT NULL,
    "cycle" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- CreateTable
CREATE TABLE "Bronze" (
    "id" SERIAL NOT NULL,
    "totalCycle" INTEGER NOT NULL DEFAULT 0,
    "currentCycle" INTEGER NOT NULL DEFAULT 0,
    "usedSlots" INTEGER NOT NULL DEFAULT 0,
    "totalSlots" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bronze_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gold" (
    "id" SERIAL NOT NULL,
    "totalCycle" INTEGER NOT NULL DEFAULT 0,
    "currentCycle" INTEGER NOT NULL DEFAULT 0,
    "usedSlots" INTEGER NOT NULL DEFAULT 0,
    "totalSlots" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Gold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diamond" (
    "id" SERIAL NOT NULL,
    "totalCycle" INTEGER NOT NULL DEFAULT 0,
    "currentCycle" INTEGER NOT NULL DEFAULT 0,
    "usedSlots" INTEGER NOT NULL DEFAULT 0,
    "totalSlots" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Diamond_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageOrder" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "package" "PackageType" NOT NULL,
    "cycle" INTEGER NOT NULL,
    "deliveryNote" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referrers" (
    "id" SERIAL NOT NULL,
    "package" "PackageType" NOT NULL,
    "first" TEXT NOT NULL,
    "second" TEXT,
    "third" TEXT,
    "forth" TEXT,
    "fifth" TEXT,
    "sixth" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Referrers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalWalletRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "downlineName" TEXT,
    "sponsorUsername" TEXT,
    "generation" TEXT,
    "salesAgent" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "cycle" INTEGER,
    "incomeType" "IncomeType" NOT NULL,
    "package" "PackageType",
    "productType" "ProductType",
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithdrawalWalletRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "wallets" "WithdrawalRequestWallets" NOT NULL,
    "message" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bpc" (
    "id" SERIAL NOT NULL,
    "facebookAdsLink" TEXT,
    "facebookAdsPhoto" TEXT,
    "facebookGroupLink" TEXT,
    "whatsappGroupPhoto" TEXT,
    "zoomMeetingLink" TEXT,
    "youtubeVideoLink" TEXT,
    "tiktokVideoLink" TEXT,
    "signupUsernames" JSONB,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bpc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopOrders" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "sellerId" INTEGER,
    "status" "ShopStatus" NOT NULL DEFAULT 'NOT_PAID',
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tx_ref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contants" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "bankName" TEXT NOT NULL DEFAULT '',
    "accountNumber" TEXT NOT NULL DEFAULT '',
    "accountName" TEXT NOT NULL DEFAULT '',
    "bronze" DOUBLE PRECISION NOT NULL,
    "gold" DOUBLE PRECISION NOT NULL,
    "diamond" DOUBLE PRECISION NOT NULL,
    "bronzeRefBonus" DOUBLE PRECISION NOT NULL,
    "goldRefBonus" DOUBLE PRECISION NOT NULL,
    "diamondRefBonus" DOUBLE PRECISION NOT NULL,
    "bronzeTestimonyBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "goldTestimonyBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamondTestimonyBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "bronzeWelcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "goldWelcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamondWelcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "bronzeCompletionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "goldCompletionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "diamondCompletionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
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

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "sender" "Sender" NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "narration" TEXT NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("sid")
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
CREATE UNIQUE INDEX "User_accountNumber_key" ON "User"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionReference_key" ON "Transactions"("transactionReference");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_settlementReference_key" ON "Transactions"("settlementReference");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_sessionID_key" ON "Transactions"("sessionID");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_userId_key" ON "BlockedUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ewallet_userId_key" ON "Ewallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalWallet_userId_key" ON "WithdrawalWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonyBonus_userId_key" ON "TestimonyBonus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UnclaimedRewards_userId_key" ON "UnclaimedRewards"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bronze_userId_key" ON "Bronze"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Gold_userId_key" ON "Gold"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Diamond_userId_key" ON "Diamond"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ewallet" ADD CONSTRAINT "Ewallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalWallet" ADD CONSTRAINT "WithdrawalWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesIncomeBonus" ADD CONSTRAINT "SalesIncomeBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleLeaderBonus" ADD CONSTRAINT "CycleLeaderBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferrerIncome" ADD CONSTRAINT "ReferrerIncome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleWelcomeBonus" ADD CONSTRAINT "CycleWelcomeBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonyBonus" ADD CONSTRAINT "TestimonyBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonyRecords" ADD CONSTRAINT "TestimonyRecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionBonus" ADD CONSTRAINT "CompletionBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnclaimedRewards" ADD CONSTRAINT "UnclaimedRewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bronze" ADD CONSTRAINT "Bronze_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gold" ADD CONSTRAINT "Gold_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diamond" ADD CONSTRAINT "Diamond_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOrder" ADD CONSTRAINT "PackageOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referrers" ADD CONSTRAINT "Referrers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalWalletRecord" ADD CONSTRAINT "WithdrawalWalletRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bpc" ADD CONSTRAINT "Bpc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopOrders" ADD CONSTRAINT "ShopOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopOrders" ADD CONSTRAINT "ShopOrders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
