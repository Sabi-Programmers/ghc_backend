-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'ADMIN',

    UNIQUE INDEX `Admin_username_key`(`username`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `sponsorUsername` VARCHAR(191) NOT NULL DEFAULT 'GHC',
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `hasFunded` BOOLEAN NOT NULL DEFAULT false,
    `displayPhoto` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `accountNumber` BIGINT NULL,
    `accountName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_accountNumber_key`(`accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ewallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `virtualBankName` VARCHAR(191) NOT NULL,
    `accountNumber` BIGINT NOT NULL,
    `accountName` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Ewallet_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaderCycleBonus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `LeaderCycleBonus_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WithdrawalWallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `leaderCycle` DOUBLE NOT NULL DEFAULT 0.00,
    `salesIncome` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `WithdrawalWallet_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesIncomeBonus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `SalesIncomeBonus_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferrerIncome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ReferrerIncome_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CycleWelcomeBonus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `CycleWelcomeBonus_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestimonyBonus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `bronzeCount` INTEGER NOT NULL DEFAULT 0,
    `goldCount` INTEGER NOT NULL DEFAULT 0,
    `diamondCount` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `TestimonyBonus_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompletionBonus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `CompletionBonus_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnclaimedRewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` DOUBLE NOT NULL DEFAULT 0.00,
    `bronzeLostCount` INTEGER NOT NULL DEFAULT 0,
    `gold` DOUBLE NOT NULL DEFAULT 0.00,
    `goldLostCount` INTEGER NOT NULL DEFAULT 0,
    `diamond` DOUBLE NOT NULL DEFAULT 0.00,
    `diamondLostCount` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `UnclaimedRewards_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package` ENUM('DIAMOND', 'GOLD', 'BRONZE') NOT NULL,
    `cycle` JSON NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Packages_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackagesPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bronze` INTEGER NOT NULL,
    `gold` INTEGER NOT NULL,
    `diamond` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ewallet` ADD CONSTRAINT `Ewallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaderCycleBonus` ADD CONSTRAINT `LeaderCycleBonus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WithdrawalWallet` ADD CONSTRAINT `WithdrawalWallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesIncomeBonus` ADD CONSTRAINT `SalesIncomeBonus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferrerIncome` ADD CONSTRAINT `ReferrerIncome_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleWelcomeBonus` ADD CONSTRAINT `CycleWelcomeBonus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestimonyBonus` ADD CONSTRAINT `TestimonyBonus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletionBonus` ADD CONSTRAINT `CompletionBonus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnclaimedRewards` ADD CONSTRAINT `UnclaimedRewards_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Packages` ADD CONSTRAINT `Packages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
