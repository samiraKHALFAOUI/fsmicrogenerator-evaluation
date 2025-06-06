import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";
export interface Inventory {
  _id: string;
  etatObjet: string;
  product: Product;
  type: string;
  raison : string;
  date: Date | string;
  quantity: number;
  price: number;
  transactionLine: TransactionLine;
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
