/*
  Warnings:

  - You are about to drop the column `packageId` on the `PackageOrder` table. All the data in the column will be lost.
  - The `status` column on the `PackageOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `genealogy` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `package` to the `PackageOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_userId_fkey";

-- DropForeignKey
ALTER TABLE "PackageOrder" DROP CONSTRAINT "PackageOrder_packageId_fkey";

-- DropIndex
DROP INDEX "PackageOrder_packageId_key";

-- AlterTable
ALTER TABLE "PackageOrder" DROP COLUMN "packageId",
ADD COLUMN     "package" "PackageType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "genealogy",
ADD COLUMN     "fifth" TEXT,
ADD COLUMN     "first" TEXT NOT NULL,
ADD COLUMN     "forth" TEXT,
ADD COLUMN     "second" TEXT,
ADD COLUMN     "sixth" TEXT,
ADD COLUMN     "third" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCycleLeader" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Package";

-- CreateTable
CREATE TABLE "Bronze" (
    "id" SERIAL NOT NULL,
    "totalCycle" INTEGER NOT NULL DEFAULT 0,
    "currentCycle" INTEGER NOT NULL DEFAULT 0,
    "usedSlots" INTEGER NOT NULL DEFAULT 0,
    "totalSlots" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diamond_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bronze_userId_key" ON "Bronze"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Gold_userId_key" ON "Gold"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Diamond_userId_key" ON "Diamond"("userId");

-- AddForeignKey
ALTER TABLE "Bronze" ADD CONSTRAINT "Bronze_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gold" ADD CONSTRAINT "Gold_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diamond" ADD CONSTRAINT "Diamond_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
