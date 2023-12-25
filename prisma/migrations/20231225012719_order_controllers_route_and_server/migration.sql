/*
  Warnings:

  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderAndProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderAndProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "OrderAndProducts" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "size" "Size" NOT NULL;
