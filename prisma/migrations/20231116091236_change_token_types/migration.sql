/*
  Warnings:

  - You are about to drop the column `emailToken` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[OTP]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Token_emailToken_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "emailToken",
ADD COLUMN     "OTP" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Token_OTP_key" ON "Token"("OTP");
