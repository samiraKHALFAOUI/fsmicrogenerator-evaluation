import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../shared/guards/auth.guard";
import { ListCurrencyComponent } from "./gestion-currency/list-currency/list-currency.component";
import { AddCurrencyComponent } from "./gestion-currency/add-currency/add-currency.component";
import { DetailCurrencyComponent } from "./gestion-currency/detail-currency/detail-currency.component";
import { CurrencyResolver } from "src/app/shared/resolvers/CurrencyManagement/currency.resolver";
import { ListExchangeRateComponent } from "./gestion-exchange-rate/list-exchange-rate/list-exchange-rate.component";
import { AddExchangeRateComponent } from "./gestion-exchange-rate/add-exchange-rate/add-exchange-rate.component";
import { CloneExchangeRateComponent } from "./gestion-exchange-rate/clone-exchange-rate/clone-exchange-rate.component";
import { DetailExchangeRateComponent } from "./gestion-exchange-rate/detail-exchange-rate/detail-exchange-rate.component";
import { ExchangeRateResolver } from "src/app/shared/resolvers/CurrencyManagement/exchange-rate.resolver";

const routes: Routes = [
  {
    path: "currency",
    children: [
      {
        path: "",
        component: ListCurrencyComponent,
        data: {
          title: "code_13187",
          breadcrumb: "code_13187",
          breadcrumbURLs: [],
          service: "currency",
          type: "list",
        },
        resolve: {
          dataR: CurrencyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddCurrencyComponent,
        data: {
          title: "code_6769",
          breadcrumb: "code_13187/code_6769",
          breadcrumbURLs: ["/CurrencyManagements/currency"],
          service: "currency",
          type: "add",
        },
        resolve: {
          dataR: CurrencyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddCurrencyComponent,
        data: {
          title: "code_13188",
          breadcrumb: "code_13187/code_13188",
          breadcrumbURLs: ["/CurrencyManagements/currency"],
          service: "currency",
          type: "edit",
        },
        resolve: {
          dataR: CurrencyResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailCurrencyComponent,
        data: {
          title: "code_13189",
          breadcrumb: "code_13187/code_13189",
          breadcrumbURLs: ["/CurrencyManagements/currency"],
          service: "currency",
          type: "detail",
        },
        resolve: {
          dataR: CurrencyResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_378",
      type: "currency",
      breadcrumb: "code_378",
      breadcrumbURLs: [""],
      module: "CurrencyManagement",
    },
  },
  {
    path: "exchangeRate",
    children: [
      {
        path: "",
        component: ListExchangeRateComponent,
        data: {
          title: "code_13181",
          breadcrumb: "code_13181",
          breadcrumbURLs: [],
          service: "exchangeRate",
          type: "list",
        },
        resolve: {
          dataR: ExchangeRateResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "add",
        component: AddExchangeRateComponent,
        data: {
          title: "code_13182",
          breadcrumb: "code_13181/code_13182",
          breadcrumbURLs: ["/CurrencyManagements/exchangeRate"],
          service: "exchangeRate",
          type: "add",
        },
        resolve: {
          dataR: ExchangeRateResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: AddExchangeRateComponent,
        data: {
          title: "code_13183",
          breadcrumb: "code_13181/code_13183",
          breadcrumbURLs: ["/CurrencyManagements/exchangeRate"],
          service: "exchangeRate",
          type: "edit",
        },
        resolve: {
          dataR: ExchangeRateResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "clone/:id",
        component: CloneExchangeRateComponent,
        data: {
          title: "code_13184",
          breadcrumb: "code_13181/code_13184",
          breadcrumbURLs: ["/CurrencyManagements/exchangeRate"],
          service: "exchangeRate",
          type: "clone",
        },
        resolve: {
          dataR: ExchangeRateResolver,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "detail/:id",
        component: DetailExchangeRateComponent,
        data: {
          title: "code_13185",
          breadcrumb: "code_13181/code_13185",
          breadcrumbURLs: ["/CurrencyManagements/exchangeRate"],
          service: "exchangeRate",
          type: "detail",
        },
        resolve: {
          dataR: ExchangeRateResolver,
        },
        canActivate: [AuthGuard],
      },
    ],
    data: {
      title: "code_13159",
      type: "exchangeRate",
      breadcrumb: "code_13159",
      breadcrumbURLs: [""],
      module: "CurrencyManagement",
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrencyManagementRoutingModule {}
