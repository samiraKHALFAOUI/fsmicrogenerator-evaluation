import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListCustomerComponent } from "./gestion-customer/list-customer/list-customer.component";
import { TranslateCustomerComponent } from "./gestion-customer/translate-customer/translate-customer.component";
import { AddCustomerComponent } from "./gestion-customer/add-customer/add-customer.component";
import { CloneCustomerComponent } from "./gestion-customer/clone-customer/clone-customer.component";
import { DetailCustomerComponent } from "./gestion-customer/detail-customer/detail-customer.component";
import { CustomerResolver } from "src/app/shared/resolvers/CustomerManagement/customer.resolver";
const routes: Routes = [
  {
    path: "customer",
    children: [
      {
        path: "",
        component: ListCustomerComponent,
        data: {
          title: "code_17539",
          breadcrumb: "code_17539",
          breadcrumbURLs: [],
          service: "customer",
          type: "list",
        },
        resolve: {
          dataR: CustomerResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddCustomerComponent,
        data: {
          title: "code_17540",
          breadcrumb: "code_17539/code_17540",
          breadcrumbURLs: ["/CustomerManagements/customer"],
          service: "customer",
          type: "add",
        },
        resolve: {
          dataR: CustomerResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddCustomerComponent,
        data: {
          title: "code_17541",
          breadcrumb: "code_17539/code_17541",
          breadcrumbURLs: ["/CustomerManagements/customer"],
          service: "customer",
          type: "edit",
        },
        resolve: {
          dataR: CustomerResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "clone/:id",
        component: CloneCustomerComponent,
        data: {
          title: "code_17542",
          breadcrumb: "code_17539/code_17542",
          breadcrumbURLs: ["/CustomerManagements/customer"],
          service: "customer",
          type: "clone",
        },
        resolve: {
          dataR: CustomerResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailCustomerComponent,
        data: {
          title: "code_17543",
          breadcrumb: "code_17539/code_17543",
          breadcrumbURLs: ["/CustomerManagements/customer"],
          service: "customer",
          type: "detail",
        },
        resolve: {
          dataR: CustomerResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "translate/:id",
        component: TranslateCustomerComponent,
        data: {
          title: "code_17544",
          breadcrumb: "code_17539/code_17544",
          breadcrumbURLs: ["/CustomerManagements/customer"],
          service: "customer",
          type: "translate",
        },
        resolve: {
          dataR: CustomerResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_502",
      type: "customer",
      breadcrumb: "code_502",
      breadcrumbURLs: [""],
      module: "CustomerManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerManagementRoutingModule {}
