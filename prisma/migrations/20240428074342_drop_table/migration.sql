/*
  Warnings:

  - You are about to drop the `packagedownline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `packagedownline` DROP FOREIGN KEY `PackageDownline_packageId_fkey`;

-- AlterTable
ALTER TABLE `package` ADD COLUMN `availableSlot` INTEGER NOT NULL DEFAULT 9,
    ADD COLUMN `packageDownlines` JSON NULL;

-- DropTable
DROP TABLE `packagedownline`;
