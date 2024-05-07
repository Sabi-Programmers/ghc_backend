/*
  Warnings:

  - You are about to drop the column `bronze` on the `ReferrerIncome` table. All the data in the column will be lost.
  - You are about to drop the column `diamond` on the `ReferrerIncome` table. All the data in the column will be lost.
  - You are about to drop the column `gold` on the `ReferrerIncome` table. All the data in the column will be lost.
  - Added the required column `cycle` to the `ReferrerIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package` to the `ReferrerIncome` table without a default value. This is not possible if the table is not empty.

*/
DELETE FROM "ReferrerIncome";

-- DropIndex
DROP INDEX "ReferrerIncome_userId_key";

-- AlterTable
ALTER TABLE "ReferrerIncome" DROP COLUMN "bronze",
DROP COLUMN "diamond",
DROP COLUMN "gold",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "cycle" INTEGER NOT NULL,
ADD COLUMN     "package" "PackageType" NOT NULL;
