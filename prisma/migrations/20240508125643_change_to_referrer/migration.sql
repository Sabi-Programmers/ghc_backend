/*
  Warnings:

  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_userId_fkey";

-- DropTable
DROP TABLE "Referral";

-- CreateTable
CREATE TABLE "Referrers" (
    "id" SERIAL NOT NULL,
    "package" "PackageType" NOT NULL,
    "first" TEXT NOT NULL,
    "second" TEXT,
    "third" TEXT,
    "forth" TEXT,
    "fifth" TEXT,
    "sixth" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referrers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referrers_userId_key" ON "Referrers"("userId");

-- AddForeignKey
ALTER TABLE "Referrers" ADD CONSTRAINT "Referrers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
