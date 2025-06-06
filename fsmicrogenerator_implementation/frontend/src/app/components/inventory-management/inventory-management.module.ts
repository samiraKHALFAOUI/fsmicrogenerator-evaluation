import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { InventoryResolver } from "src/app/shared/resolvers/InventoryManagement/inventory.resolver";

import { InventoryManagementRoutingModule } from "./inventory-management-routing.module";
import { ListInventoryComponent } from "./gestion-inventory/list-inventory/list-inventory.component";
import { SubInventoryComponent } from "./subComponents/sub-inventory/sub-inventory.component";
import { DetailInventoryComponent } from "./gestion-inventory/detail-inventory/detail-inventory.component";

@NgModule({
  declarations: [
    ListInventoryComponent,
    SubInventoryComponent,
    DetailInventoryComponent,
  ],
  imports: [
    SharedModule,
    InventoryManagementRoutingModule,
  ],
  exports: [SubInventoryComponent],
  providers: [InventoryResolver],
})
export class InventoryManagementModule {}
