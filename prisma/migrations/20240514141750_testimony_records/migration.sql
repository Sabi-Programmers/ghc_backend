-- CreateTable
CREATE TABLE "TestimonyRecords" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "package" "PackageType" NOT NULL,
    "completedCycles" INTEGER NOT NULL DEFAULT 0,
    "lastPaidCycles" INTEGER NOT NULL DEFAULT 0,
    "facebookLink" TEXT,
    "youtubeLink" TEXT,
    "tiktokLink" TEXT,
    "message" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestimonyRecords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestimonyRecords" ADD CONSTRAINT "TestimonyRecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
