import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListInventoryComponent } from "./gestion-inventory/list-inventory/list-inventory.component";
import { DetailInventoryComponent } from "./gestion-inventory/detail-inventory/detail-inventory.component";
import { InventoryResolver } from "src/app/shared/resolvers/InventoryManagement/inventory.resolver";
const routes: Routes = [
  {
    path: "inventory",
    children: [
      {
        path: "",
        component: ListInventoryComponent,
        data: {
          title: "code_9411",
          breadcrumb: "code_9411",
          breadcrumbURLs: [],
          service: "inventory",
          type: "list",
        },
        resolve: {
          dataR: InventoryResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailInventoryComponent,
        data: {
          title: "code_9414",
          breadcrumb: "code_9411/code_9414",
          breadcrumbURLs: ["/InventoryManagements/inventory"],
          service: "inventory",
          type: "detail",
        },
        resolve: {
          dataR: InventoryResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18415",
      type: "inventory",
      breadcrumb: "code_18415",
      breadcrumbURLs: [""],
      module: "InventoryManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryManagementRoutingModule {}
