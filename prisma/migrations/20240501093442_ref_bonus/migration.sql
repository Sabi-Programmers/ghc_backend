/*
  Warnings:

  - Added the required column `bronzeRefBonus` to the `PackagePrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diamondRefBonus` to the `PackagePrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goldRefBonus` to the `PackagePrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackagePrice" ADD COLUMN "bronzeRefBonus" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "diamondRefBonus" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "goldRefBonus" DOUBLE PRECISION DEFAULT 0;

