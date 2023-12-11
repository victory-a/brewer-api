/*
  Warnings:

  - You are about to drop the `Pricing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pricing" DROP CONSTRAINT "Pricing_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "largePrice" DECIMAL(6,2),
ADD COLUMN     "mediumPrice" DECIMAL(6,2);

-- DropTable
DROP TABLE "Pricing";
