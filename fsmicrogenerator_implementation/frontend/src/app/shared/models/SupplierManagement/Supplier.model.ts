import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
import { Product } from "src/app/shared/models/ProductManagement/Product.model";
export interface Supplier {
  _id: string;
  etatObjet: string;
  logo: string;
  translations: { language: string; name: string; address: string };
  email: string;
  officePhoneNumber: string;
  isActif: boolean;
  purchases: Transaction[];
  products: Product[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
