/*
  Warnings:

  - You are about to drop the column `usernames` on the `WithdrawalWalletRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WithdrawalWalletRecord" DROP COLUMN "usernames",
ADD COLUMN     "username" TEXT;
