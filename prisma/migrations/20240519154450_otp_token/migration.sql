-- AlterTable
ALTER TABLE "TestimonyRecords" ADD COLUMN     "feedbackMessage" TEXT;

-- CreateTable
CREATE TABLE "OtpToken" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);
