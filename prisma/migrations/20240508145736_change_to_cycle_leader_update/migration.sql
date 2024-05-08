/*
  Warnings:

  - You are about to drop the `LeaderCycleBonus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `downlineName` to the `CycleLeaderBonus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downlineUsername` to the `CycleLeaderBonus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sponsorUsername` to the `CycleLeaderBonus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LeaderCycleBonus" DROP CONSTRAINT "LeaderCycleBonus_userId_fkey";

-- AlterTable
ALTER TABLE "CycleLeaderBonus" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "downlineName" TEXT NOT NULL,
ADD COLUMN     "downlineUsername" TEXT NOT NULL,
ADD COLUMN     "sponsorUsername" TEXT NOT NULL;

-- DropTable
DROP TABLE "LeaderCycleBonus";
