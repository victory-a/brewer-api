/*
  Warnings:

  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "basePrice" DECIMAL(6,2) NOT NULL;
