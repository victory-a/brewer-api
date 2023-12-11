/*
  Warnings:

  - The values [S,M,L] on the enum `Size` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `additionalPricing` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Size_new" AS ENUM ('small', 'medium', 'large');
ALTER TABLE "Product" ALTER COLUMN "sizes" TYPE "Size_new"[] USING ("sizes"::text::"Size_new"[]);
ALTER TYPE "Size" RENAME TO "Size_old";
ALTER TYPE "Size_new" RENAME TO "Size";
DROP TYPE "Size_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "additionalPricing",
DROP COLUMN "price",
ADD COLUMN     "basePrice" DECIMAL(6,2) NOT NULL;

-- CreateTable
CREATE TABLE "Pricing" (
    "id" SERIAL NOT NULL,
    "small" DECIMAL(6,2) NOT NULL,
    "medium" DECIMAL(6,2) NOT NULL,
    "large" DECIMAL(6,2) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_productId_key" ON "Pricing"("productId");

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
