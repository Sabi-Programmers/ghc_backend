-- AlterTable
ALTER TABLE "PackageOrder" ADD COLUMN     "deliveryNote" TEXT;

-- CreateTable
CREATE TABLE "Bpc" (
    "id" SERIAL NOT NULL,
    "facebookAdsLink" TEXT,
    "facebookAdsPhoto" TEXT,
    "facebookGroupLink" TEXT,
    "whatsappGroupPhoto" TEXT,
    "zoomMeetingLink" TEXT,
    "youtubeVideoLink" TEXT,
    "tiktokVideoLink" TEXT,
    "signupUsernames" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bpc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bpc" ADD CONSTRAINT "Bpc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
