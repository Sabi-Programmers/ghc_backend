/*
  Warnings:

  - You are about to alter the column `bronze` on the `packagesprice` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `gold` on the `packagesprice` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `diamond` on the `packagesprice` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `packagesprice` MODIFY `bronze` DOUBLE NOT NULL,
    MODIFY `gold` DOUBLE NOT NULL,
    MODIFY `diamond` DOUBLE NOT NULL;
