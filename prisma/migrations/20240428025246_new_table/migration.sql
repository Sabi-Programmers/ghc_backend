/*
  Warnings:

  - You are about to drop the column `availableSlot` on the `package` table. All the data in the column will be lost.
  - You are about to drop the column `cycle` on the `package` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `package` DROP COLUMN `availableSlot`,
    DROP COLUMN `cycle`;

-- CreateTable
CREATE TABLE `PackageDownline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `packageId` INTEGER NOT NULL,
    `downlineUsername` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackageDownline` ADD CONSTRAINT `PackageDownline_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
