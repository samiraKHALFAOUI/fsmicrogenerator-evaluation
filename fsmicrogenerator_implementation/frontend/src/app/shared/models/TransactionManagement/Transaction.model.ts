import { TransactionLine } from "./TransactionLine.model";

import { Supplier } from "src/app/shared/models/SupplierManagement/Supplier.model";
import { Customer } from "src/app/shared/models/CustomerManagement/Customer.model";
export interface Transaction {
  _id: string;
  etatObjet: string;
  reference: string;
  type: string;
  registrationDate: Date | string;
  status: string;
  savedBy: string;
  transactionLines: TransactionLine[];
  supplier: Supplier;
  customer: Customer;
  
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
