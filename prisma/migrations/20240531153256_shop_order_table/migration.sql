-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('NOT_PAID', 'PENDING', 'DELIVERED', 'PAYMENT_FAILED');

-- CreateTable
CREATE TABLE "ShopOrders" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "sellerId" INTEGER,
    "status" "ShopStatus" NOT NULL DEFAULT 'NOT_PAID',
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tx_ref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopOrders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShopOrders" ADD CONSTRAINT "ShopOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopOrders" ADD CONSTRAINT "ShopOrders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
