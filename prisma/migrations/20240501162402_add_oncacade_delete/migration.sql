-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_userId_fkey";

-- DropForeignKey
ALTER TABLE "PackageOrder" DROP CONSTRAINT "PackageOrder_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PackageOrder" DROP CONSTRAINT "PackageOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_userId_fkey";

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOrder" ADD CONSTRAINT "PackageOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOrder" ADD CONSTRAINT "PackageOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
