import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListSupplierComponent } from "./gestion-supplier/list-supplier/list-supplier.component";
import { TranslateSupplierComponent } from "./gestion-supplier/translate-supplier/translate-supplier.component";
import { AddSupplierComponent } from "./gestion-supplier/add-supplier/add-supplier.component";
import { CloneSupplierComponent } from "./gestion-supplier/clone-supplier/clone-supplier.component";
import { DetailSupplierComponent } from "./gestion-supplier/detail-supplier/detail-supplier.component";
import { SupplierResolver } from "src/app/shared/resolvers/SupplierManagement/supplier.resolver";
const routes: Routes = [
  {
    path: "supplier",
    children: [
      {
        path: "",
        component: ListSupplierComponent,
        data: {
          title: "code_17545",
          breadcrumb: "code_17545",
          breadcrumbURLs: [],
          service: "supplier",
          type: "list",
        },
        resolve: {
          dataR: SupplierResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddSupplierComponent,
        data: {
          title: "code_17546",
          breadcrumb: "code_17545/code_17546",
          breadcrumbURLs: ["/SupplierManagements/supplier"],
          service: "supplier",
          type: "add",
        },
        resolve: {
          dataR: SupplierResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddSupplierComponent,
        data: {
          title: "code_17547",
          breadcrumb: "code_17545/code_17547",
          breadcrumbURLs: ["/SupplierManagements/supplier"],
          service: "supplier",
          type: "edit",
        },
        resolve: {
          dataR: SupplierResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "clone/:id",
        component: CloneSupplierComponent,
        data: {
          title: "code_17548",
          breadcrumb: "code_17545/code_17548",
          breadcrumbURLs: ["/SupplierManagements/supplier"],
          service: "supplier",
          type: "clone",
        },
        resolve: {
          dataR: SupplierResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailSupplierComponent,
        data: {
          title: "code_17549",
          breadcrumb: "code_17545/code_17549",
          breadcrumbURLs: ["/SupplierManagements/supplier"],
          service: "supplier",
          type: "detail",
        },
        resolve: {
          dataR: SupplierResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateSupplierComponent,
        data: {
          title: "code_17550",
          breadcrumb: "code_17545/code_17550",
          breadcrumbURLs: ["/SupplierManagements/supplier"],
          service: "supplier",
          type: "translate",
        },
        resolve: {
          dataR: SupplierResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18426",
      type: "supplier",
      breadcrumb: "code_18426",
      breadcrumbURLs: [""],
      module: "SupplierManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierManagementRoutingModule {}
