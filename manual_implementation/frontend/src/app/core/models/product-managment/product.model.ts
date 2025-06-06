import { Supplier } from "../../../shared/models/supplierModel/supplier.model";
import { Categorie } from "./categorie.model";

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  salePrice: number;
  currency: string;
  stockQuantity: number;
  unit: 'piece' | 'kg' | 'liter';
  status: 'available' | 'out_of_stock' | 'discontinued';
  category: Categorie;
  supplier: Supplier;
  createdAt?: Date;
  updatedAt?: Date;
}