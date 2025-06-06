import { NgModule } from "@angular/core";
import { CurrencyResolver } from "src/app/shared/resolvers/CurrencyManagement/currency.resolver";
import { ExchangeRateResolver } from "src/app/shared/resolvers/CurrencyManagement/exchange-rate.resolver";
import { SharedModule } from "src/app/shared/shared.module";

import { CurrencyManagementRoutingModule } from "./currency-management-routing.module";
import { AddCurrencyComponent } from "./gestion-currency/add-currency/add-currency.component";
import { DetailCurrencyComponent } from "./gestion-currency/detail-currency/detail-currency.component";
import { ListCurrencyComponent } from "./gestion-currency/list-currency/list-currency.component";
import { AddExchangeRateComponent } from "./gestion-exchange-rate/add-exchange-rate/add-exchange-rate.component";
import { CloneExchangeRateComponent } from "./gestion-exchange-rate/clone-exchange-rate/clone-exchange-rate.component";
import { DetailExchangeRateComponent } from "./gestion-exchange-rate/detail-exchange-rate/detail-exchange-rate.component";
import { ListExchangeRateComponent } from "./gestion-exchange-rate/list-exchange-rate/list-exchange-rate.component";
import { SubExchangeRateComponent } from "./subComponents/sub-exchange-rate/sub-exchange-rate.component";
import { SubCurrencyComponent } from "./subComponents/sub-currency/sub-currency.component";



@NgModule({
  declarations: [
    AddCurrencyComponent,
    ListCurrencyComponent,
    DetailCurrencyComponent,
    AddExchangeRateComponent,
    CloneExchangeRateComponent,
    ListExchangeRateComponent,
    SubExchangeRateComponent,
    DetailExchangeRateComponent,
    SubCurrencyComponent
  ],
  imports: [
    SharedModule,
    CurrencyManagementRoutingModule

  ],
  exports: [


  ],
  providers: [
    CurrencyResolver,
    ExchangeRateResolver,
  ],
})
export class CurrencyManagementModule {}
