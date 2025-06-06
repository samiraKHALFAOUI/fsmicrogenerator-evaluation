export interface Inventory {
  _id: string;
  reference: string;
  type: "ENTRY" | "EXIT";
  date: Date | string;
  raison: string;
  quantity: number;
  price: number;
  product: any;
  transaction_ligne: any;
  createdAt?: string;
  updatedAt?: string;
}
