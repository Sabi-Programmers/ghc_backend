-- CreateTable
CREATE TABLE "Sessions" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("sid")
);
