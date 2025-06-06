import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SupplierResolver } from "src/app/shared/resolvers/SupplierManagement/supplier.resolver";

import { SupplierManagementRoutingModule } from "./supplier-management-routing.module";
import { AddSupplierComponent } from "./gestion-supplier/add-supplier/add-supplier.component";
import { CloneSupplierComponent } from "./gestion-supplier/clone-supplier/clone-supplier.component";
import { TranslateSupplierComponent } from "./gestion-supplier/translate-supplier/translate-supplier.component";
import { ListSupplierComponent } from "./gestion-supplier/list-supplier/list-supplier.component";
import { SubSupplierComponent } from "./subComponents/sub-supplier/sub-supplier.component";
import { DetailSupplierComponent } from "./gestion-supplier/detail-supplier/detail-supplier.component";

import { ProductManagementModule } from "../product-management/product-management.module";
import { TransactionManagementModule } from "../transaction-management/transaction-management.module";
@NgModule({
  declarations: [
    AddSupplierComponent,
    CloneSupplierComponent,
    TranslateSupplierComponent,
    ListSupplierComponent,
    SubSupplierComponent,
    DetailSupplierComponent,
  ],
  imports: [
    SharedModule,
    SupplierManagementRoutingModule,
    ProductManagementModule,
    TransactionManagementModule,
  ],
  exports: [SubSupplierComponent],
  providers: [SupplierResolver],
})
export class SupplierManagementModule {}
