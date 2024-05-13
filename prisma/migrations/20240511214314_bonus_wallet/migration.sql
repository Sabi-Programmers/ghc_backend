-- CreateTable
CREATE TABLE "BonusWallet" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "cycle" INTEGER NOT NULL,
    "incomeType" TEXT NOT NULL,
    "package" "PackageType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BonusWallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BonusWallet" ADD CONSTRAINT "BonusWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
