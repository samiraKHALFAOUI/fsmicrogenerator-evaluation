import { Product } from "./Product.model";

export interface Category {
  _id: string;
  etatObjet: string;
  icon: string;
  translations: { language: string; name: string };
  products: Product[];
  parentCategory: Category;
  subCategories: Category[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
