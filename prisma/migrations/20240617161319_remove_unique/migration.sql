-- DropIndex
DROP INDEX "User_accountNumber_key";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "accountFName" DROP DEFAULT,
ALTER COLUMN "accountLName" DROP DEFAULT;
