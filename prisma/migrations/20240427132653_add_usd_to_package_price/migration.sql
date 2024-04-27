/*
  Warnings:

  - Added the required column `usdRate` to the `PackagesPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `packagesprice` ADD COLUMN `usdRate` DOUBLE NOT NULL;
