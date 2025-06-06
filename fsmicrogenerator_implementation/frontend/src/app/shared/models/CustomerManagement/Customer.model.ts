import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
export interface Customer {
  _id: string;
  etatObjet: string;
  photo: string;
  translations: { language: string; name: string; address: string };
  email: string;
  phoneNumber: string;
  orders: Transaction[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
