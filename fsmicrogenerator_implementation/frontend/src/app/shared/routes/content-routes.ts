import { Routes } from "@angular/router";
import { DashboardComponent } from "src/app/components/dashboard/dashboard.component";
import { AuthGuard } from "../guards/auth.guard";
import { Page404Component } from "src/app/shared/components/page404/page404.component";

export const content: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    data: {
      title: "code_2347",
      breadcrumb: "code_2347",
      service: "accueil",
      type: "accueil",
      menu: true,
      module: "dashboard",
    },
    canActivate: [AuthGuard],
  },

  {
    path: "AccountManagement",
    loadChildren: () =>
      import(
        "../../components/account-management/account-management.module"
      ).then((m) => m.AccountManagementModule),
    data: {
      title: "code_18472",
      type: "module",
      menu: true,
      module: "AccountManagement",
    },
  },

  {
    path: "CurrencyManagement",
    loadChildren: () =>
      import(
        "../../components/currency-management/currency-management.module"
      ).then((m) => m.CurrencyManagementModule),
    data: {
      title: "code_13174",
      type: "module",
      menu: true,
      module: "CurrencyManagement",
    },
  },

  {
    path: "CustomerManagement",
    loadChildren: () =>
      import(
        "../../components/customer-management/customer-management.module"
      ).then((m) => m.CustomerManagementModule),
    data: {
      title: "code_18425",
      type: "module",
      menu: true,
      module: "CustomerManagement",
    },
  },

  {
    path: "InventoryManagement",
    loadChildren: () =>
      import(
        "../../components/inventory-management/inventory-management.module"
      ).then((m) => m.InventoryManagementModule),
    data: {
      title: "code_18421",
      type: "module",
      menu: true,
      module: "InventoryManagement",
    },
  },

  {
    path: "ProductManagement",
    loadChildren: () =>
      import(
        "../../components/product-management/product-management.module"
      ).then((m) => m.ProductManagementModule),
    data: {
      title: "code_10690",
      type: "module",
      menu: true,
      module: "ProductManagement",
    },
  },

  {
    path: "SupplierManagement",
    loadChildren: () =>
      import(
        "../../components/supplier-management/supplier-management.module"
      ).then((m) => m.SupplierManagementModule),
    data: {
      title: "code_18433",
      type: "module",
      menu: true,
      module: "SupplierManagement",
    },
  },

  {
    path: "TaxonomyManagement",
    loadChildren: () =>
      import("../../components/taxonomy-management/taxonomy-management.module").then(
        (m) => m.TaxonomyManagementModule
      ),
    data: {
      title: "code_4214",
      type: "module",
      menu: true,
      module: "TaxonomyManagement",
    },
  },

  {
    path: "TechnicalConfiguration",
    loadChildren: () =>
      import(
        "../../components/technical-configuration/technical-configuration.module"
      ).then((m) => m.TechnicalConfigurationModule),
    data: {
      title: "code_4213",
      type: "module",
      menu: true,
      module: "TechnicalConfiguration",
    },
  },

  {
    path: "TransactionManagement",
    loadChildren: () =>
      import("../../components/transaction-management/transaction-management.module").then(
        (m) => m.TransactionManagementModule
      ),
    data: {
      title: "code_5288",
      type: "module",
      menu: true,
      module: "TransactionManagement",
    },
  },

  {
    path: "PageNotFound",
    component: Page404Component,
    canActivate: [AuthGuard],
    data: {
      title: "menu.notFound",
      menu: true,
      module: "PageNotFound",
    },
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "PageNotFound",
  },
];
