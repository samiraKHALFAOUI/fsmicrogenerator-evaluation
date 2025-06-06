import { Category } from "./Category.model";
import { Taxonomy} from "src/app/shared/models/TaxonomyManagement/Taxonomy.model";

import { Supplier } from "src/app/shared/models/SupplierManagement/Supplier.model";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";
import { Currency } from "src/app/shared/models/CurrencyManagement/Currency.model";
export interface Product {
  _id: string;
  etatObjet: string;
  reference: string;
  category: Category;
  image: string;
  translations: { language: string; name: string; description: string };
  salePrice: number;
  currency: Currency;
  stockQuantity: number;
  unit: Taxonomy;
  status: string;
  supplier: Supplier;
  transactionLines: TransactionLine[];
  inventoryMovements: Inventory[];

  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
