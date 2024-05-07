/*
  Warnings:

  - Added the required column `cycle` to the `PackageOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackageOrder" ADD COLUMN     "cycle" INTEGER NOT NULL;
