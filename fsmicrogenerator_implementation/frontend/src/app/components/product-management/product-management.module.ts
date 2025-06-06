import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CategoryResolver } from "src/app/shared/resolvers/ProductManagement/category.resolver";
import { ProductResolver } from "src/app/shared/resolvers/ProductManagement/product.resolver";

import { ProductManagementRoutingModule } from "./product-management-routing.module";
import { AddCategoryComponent } from "./gestion-category/add-category/add-category.component";
import { TranslateCategoryComponent } from "./gestion-category/translate-category/translate-category.component";
import { ListCategoryComponent } from "./gestion-category/list-category/list-category.component";
import { SubCategoryComponent } from "./subComponents/sub-category/sub-category.component";
import { DetailCategoryComponent } from "./gestion-category/detail-category/detail-category.component";
import { AddProductComponent } from "./gestion-product/add-product/add-product.component";
import { CloneProductComponent } from "./gestion-product/clone-product/clone-product.component";
import { TranslateProductComponent } from "./gestion-product/translate-product/translate-product.component";
import { ListProductComponent } from "./gestion-product/list-product/list-product.component";
import { SubProductComponent } from "./subComponents/sub-product/sub-product.component";
import { DetailProductComponent } from "./gestion-product/detail-product/detail-product.component";
import { InventoryManagementModule } from "../inventory-management/inventory-management.module";
@NgModule({
  declarations: [
    AddCategoryComponent,
    TranslateCategoryComponent,
    ListCategoryComponent,
    SubCategoryComponent,
    DetailCategoryComponent,
    AddProductComponent,
    CloneProductComponent,
    TranslateProductComponent,
    ListProductComponent,
    SubProductComponent,
    DetailProductComponent,
  ],
  imports: [
    SharedModule,
    ProductManagementRoutingModule,
    InventoryManagementModule,
  ],
  exports: [SubCategoryComponent, SubProductComponent],
  providers: [CategoryResolver, ProductResolver],
})
export class ProductManagementModule {}
