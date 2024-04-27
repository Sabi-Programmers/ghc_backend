/*
  Warnings:

  - Added the required column `updatedAt` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PackagePrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `packageprice` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
