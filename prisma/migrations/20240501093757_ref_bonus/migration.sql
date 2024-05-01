/*
  Warnings:

  - Made the column `bronzeRefBonus` on table `PackagePrice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `diamondRefBonus` on table `PackagePrice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goldRefBonus` on table `PackagePrice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PackagePrice" ALTER COLUMN "bronzeRefBonus" SET NOT NULL,
ALTER COLUMN "bronzeRefBonus" DROP DEFAULT,
ALTER COLUMN "diamondRefBonus" SET NOT NULL,
ALTER COLUMN "diamondRefBonus" DROP DEFAULT,
ALTER COLUMN "goldRefBonus" SET NOT NULL,
ALTER COLUMN "goldRefBonus" DROP DEFAULT;
