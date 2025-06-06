// src/app/models/transaction-line.model.ts

import { Product } from "../product-managment/product.model";

export interface TransactionLine {
  _id?: string;
  quantity: number;
  price: number;
  currency: string;
  transaction: string;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}
