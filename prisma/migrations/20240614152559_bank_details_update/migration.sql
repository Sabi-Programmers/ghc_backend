/*
  Warnings:

  - You are about to drop the column `accountName` on the `Ewallet` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `Ewallet` table. All the data in the column will be lost.
  - You are about to drop the column `virtualBankName` on the `Ewallet` table. All the data in the column will be lost.
  - Made the column `bankName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountNumber` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contants" ADD COLUMN     "accountName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "accountNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "bankName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Ewallet" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "virtualBankName";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bankName" SET NOT NULL,
ALTER COLUMN "accountNumber" SET NOT NULL,
ALTER COLUMN "accountName" SET NOT NULL;
