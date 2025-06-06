
export interface Supplier {
  _id?: string;
  logo: string;
  name: string;
  address: string;
  email: string;
  officePhoneNumber: string;
  isAct: boolean;
  products?: [];
  transactions?: [];
  createdAt?: Date;
  updatedAt?: Date;
} 