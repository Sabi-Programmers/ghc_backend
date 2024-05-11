/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Bronze` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Bronze` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Diamond` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Diamond` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Gold` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Gold` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Referrers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Referrers` table. All the data in the column will be lost.
  - Added the required column `agent` to the `SalesIncomeBonus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `SalesIncomeBonus` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('DIGITAL', 'PHYSICAL');

-- DropIndex
DROP INDEX "SalesIncomeBonus_userId_key";

-- AlterTable
ALTER TABLE "Bronze" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "CompletionBonus" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CycleWelcomeBonus" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Diamond" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Gold" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ReferrerIncome" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Referrers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "SalesIncomeBonus" ADD COLUMN     "agent" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "productType" "ProductType" NOT NULL;
