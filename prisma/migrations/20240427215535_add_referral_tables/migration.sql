/*
  Warnings:

  - Added the required column `updatedAt` to the `PackageOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `packageorder` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package` ENUM('DIAMOND', 'GOLD', 'BRONZE') NOT NULL,
    `genealogy` JSON NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Referral_package_key`(`package`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
