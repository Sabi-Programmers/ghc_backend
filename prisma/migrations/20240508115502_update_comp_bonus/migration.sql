/*
  Warnings:

  - You are about to drop the column `bronze` on the `CompletionBonus` table. All the data in the column will be lost.
  - You are about to drop the column `diamond` on the `CompletionBonus` table. All the data in the column will be lost.
  - You are about to drop the column `gold` on the `CompletionBonus` table. All the data in the column will be lost.
  - Added the required column `cycle` to the `CompletionBonus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package` to the `CompletionBonus` table without a default value. This is not possible if the table is not empty.

*/

DELETE FROM "CompletionBonus";

-- DropIndex
DROP INDEX "CompletionBonus_userId_key";

-- AlterTable
ALTER TABLE "CompletionBonus" DROP COLUMN "bronze",
DROP COLUMN "diamond",
DROP COLUMN "gold",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "cycle" INTEGER NOT NULL,
ADD COLUMN     "package" "PackageType" NOT NULL;
