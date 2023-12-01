-- CreateEnum
CREATE TYPE "Size" AS ENUM ('S', 'M', 'L');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(6,2) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "variant" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sizes" "Size"[],
    "rating" DECIMAL(2,1) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "totalPrice" DECIMAL(6,2) NOT NULL,
    "deliveryFee" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
