import { Transaction } from "./Transaction.model";

import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";
export interface TransactionLine {
  _id: string;
  etatObjet: string;
  product: Product;
  quantity: number;
  price: number;
  currency: string;
  transaction: Transaction;
  inventoryMovement: Inventory;
  
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
