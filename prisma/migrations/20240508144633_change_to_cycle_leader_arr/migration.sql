-- CreateTable
CREATE TABLE "CycleLeaderBonus" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "package" "PackageType" NOT NULL,
    "generation" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CycleLeaderBonus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CycleLeaderBonus" ADD CONSTRAINT "CycleLeaderBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
