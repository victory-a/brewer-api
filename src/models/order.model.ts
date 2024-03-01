import { type Size } from '@prisma/client';

interface ICreateOrder {
  address: string;
  products: {
    productId: number;
    quantity: number;
    size: Size;
  }[];
}

export { type ICreateOrder };
