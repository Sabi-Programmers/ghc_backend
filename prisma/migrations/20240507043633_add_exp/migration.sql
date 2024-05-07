/*
  Warnings:

  - You are about to drop the column `expires` on the `Sessions` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "expires",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL;
