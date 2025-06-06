import { TransactionLine } from "./transactionLigne.model";

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shiped"
  | "delivred"
  | "cancelled"
  | "returned";

export type TransactionType = "purchase" | "sale";

export interface Transaction {
  _id: string;
  reference: string;
  type: TransactionType;
  date: Date | string;
  status: TransactionStatus;
  savedBy: string;
  supplier: any;
  customer: any;
  transactionLigne: TransactionLine[];
  createdAt?: string;
  updatedAt?: string;
}
