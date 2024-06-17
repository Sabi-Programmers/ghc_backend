/*
  Warnings:

  - You are about to drop the column `accountName` on the `User` table. All the data in the column will be lost.
  - Added the required column `accountFName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountLName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountName",
ADD COLUMN "accountFName" TEXT DEFAULT '' NOT NULL,
ADD COLUMN "accountLName" TEXT DEFAULT '' NOT NULL;
