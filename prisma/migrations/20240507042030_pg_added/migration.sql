/*
  Warnings:

  - The `status` column on the `WithdrawalRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'DENIED', 'PENDING');

-- AlterTable
ALTER TABLE "WithdrawalRequest" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "WithdrawalRequestStatus";

CREATE TABLE sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);
