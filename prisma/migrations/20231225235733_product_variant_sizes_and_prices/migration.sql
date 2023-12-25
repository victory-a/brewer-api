/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `largePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `mediumPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `variant` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - Added the required column `small` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "basePrice",
DROP COLUMN "largePrice",
DROP COLUMN "mediumPrice",
ADD COLUMN     "large" DECIMAL(6,2),
ADD COLUMN     "medium" DECIMAL(6,2),
ADD COLUMN     "small" DECIMAL(6,2) NOT NULL,
ALTER COLUMN "variant" SET DATA TYPE VARCHAR(20);
