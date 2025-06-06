import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListTransactionComponent } from "./gestion-transaction/list-transaction/list-transaction.component";
import { AddTransactionComponent } from "./gestion-transaction/add-transaction/add-transaction.component";
import { DetailTransactionComponent } from "./gestion-transaction/detail-transaction/detail-transaction.component";
import { TransactionResolver } from "src/app/shared/resolvers/TransactionManagement/transaction.resolver";
import { ListTransactionLineComponent } from "./gestion-transaction-line/list-transaction-line/list-transaction-line.component";
import { AddTransactionLineComponent } from "./gestion-transaction-line/add-transaction-line/add-transaction-line.component";
import { DetailTransactionLineComponent } from "./gestion-transaction-line/detail-transaction-line/detail-transaction-line.component";
import { TransactionLineResolver } from "src/app/shared/resolvers/TransactionManagement/transaction-line.resolver";
const routes: Routes = [
  {
    path: "sales",
    children: [
      {
        path: "",
        component: ListTransactionComponent,
        data: {
          title: "code_18477",
          breadcrumb: "code_18477",
          breadcrumbURLs: [],
          service: "transaction",
          option : 'sales',
          type: "list",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddTransactionComponent,
        data: {
          title: "code_5284",
          breadcrumb: "code_18477/code_5284",
          breadcrumbURLs: ["/TransactionManagements/transaction"],
          service: "transaction",
          option : 'sales',
          type: "add",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddTransactionComponent,
        data: {
          title: "code_14409",
          breadcrumb: "code_18477/code_14409",
          breadcrumbURLs: ["/TransactionManagements/transaction"],
          service: "transaction",
          option : 'sales',
          type: "edit",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailTransactionComponent,
        data: {
          title: "code_18447",
          breadcrumb: "code_18477/code_18447",
          breadcrumbURLs: ["/TransactionManagements/transaction"],
          service: "transaction",
          option : 'sales',
          type: "detail",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18440",
      type: "transaction",
      breadcrumb: "code_18440",
      breadcrumbURLs: [""],
      module: "TransactionManagement",
    },
  },

  {
    path: "purchases",
    children: [
      {
        path: "",
        component: ListTransactionComponent,
        data: {
          title: "code_18476",
          breadcrumb: "code_18476",
          breadcrumbURLs: [],
          service: "transaction",
          option : 'purchases',
          type: "list",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddTransactionComponent,
        data: {
          title: "code_5284",
          breadcrumb: "code_18476/code_5284",
          breadcrumbURLs: ["/TransactionManagements/transaction"],
          service: "transaction",
          option : 'purchases',
          type: "add",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddTransactionComponent,
        data: {
          title: "code_14409",
          breadcrumb: "code_18476/code_14409",
          breadcrumbURLs: ["/TransactionManagements/transaction"],
          service: "transaction",
          option : 'purchases',
          type: "edit",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailTransactionComponent,
        data: {
          title: "code_18447",
          breadcrumb: "code_18476/code_18447",
          breadcrumbURLs: ["/TransactionManagements/transaction"],
          service: "transaction",
          option : 'purchases',
          type: "detail",
        },
        resolve: {
          dataR: TransactionResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18441",
      type: "transaction",
      breadcrumb: "code_18441",
      breadcrumbURLs: [""],
      module: "TransactionManagement",
    },
  },

  {
    path: "transactionLine",
    children: [
      {
        path: "",
        component: ListTransactionLineComponent,
        data: {
          title: "code_18450",
          breadcrumb: "code_18450",
          breadcrumbURLs: [],
          service: "transactionLine",
          type: "list",
        },
        resolve: {
          dataR: TransactionLineResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddTransactionLineComponent,
        data: {
          title: "code_18451",
          breadcrumb: "code_18450/code_18451",
          breadcrumbURLs: ["/TransactionManagements/transactionLine"],
          service: "transactionLine",
          type: "add",
        },
        resolve: {
          dataR: TransactionLineResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddTransactionLineComponent,
        data: {
          title: "code_18452",
          breadcrumb: "code_18450/code_18452",
          breadcrumbURLs: ["/TransactionManagements/transactionLine"],
          service: "transactionLine",
          type: "edit",
        },
        resolve: {
          dataR: TransactionLineResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailTransactionLineComponent,
        data: {
          title: "code_18453",
          breadcrumb: "code_18450/code_18453",
          breadcrumbURLs: ["/TransactionManagements/transactionLine"],
          service: "transactionLine",
          type: "detail",
        },
        resolve: {
          dataR: TransactionLineResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_18434",
      type: "transactionLine",
      breadcrumb: "code_18434",
      breadcrumbURLs: [""],
      module: "TransactionManagement",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionManagementRoutingModule {}
