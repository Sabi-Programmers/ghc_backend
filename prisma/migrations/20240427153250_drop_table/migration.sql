/*
  Warnings:

  - You are about to drop the `packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packagesprice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `packages` DROP FOREIGN KEY `Packages_userId_fkey`;

-- DropTable
DROP TABLE `packages`;

-- DropTable
DROP TABLE `packagesprice`;

-- CreateTable
CREATE TABLE `Package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package` ENUM('DIAMOND', 'GOLD', 'BRONZE') NOT NULL,
    `cycle` JSON NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackagePrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL,
    `gold` DOUBLE NOT NULL,
    `diamond` DOUBLE NOT NULL,
    `usdRate` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
