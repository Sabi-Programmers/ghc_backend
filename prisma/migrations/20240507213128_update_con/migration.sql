-- AlterTable
ALTER TABLE "Contants" ADD COLUMN     "bronzeCompletionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "bronzeWelcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "diamondCompletionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "diamondWelcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "goldCompletionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "goldWelcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00;
