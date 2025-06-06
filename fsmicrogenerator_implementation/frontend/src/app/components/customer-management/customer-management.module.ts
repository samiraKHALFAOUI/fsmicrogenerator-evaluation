import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomerResolver } from "src/app/shared/resolvers/CustomerManagement/customer.resolver";

import { CustomerManagementRoutingModule } from "./customer-management-routing.module";
import { AddCustomerComponent } from "./gestion-customer/add-customer/add-customer.component";
import { CloneCustomerComponent } from "./gestion-customer/clone-customer/clone-customer.component";
import { TranslateCustomerComponent } from "./gestion-customer/translate-customer/translate-customer.component";
import { ListCustomerComponent } from "./gestion-customer/list-customer/list-customer.component";
import { SubCustomerComponent } from "./subComponents/sub-customer/sub-customer.component";
import { DetailCustomerComponent } from "./gestion-customer/detail-customer/detail-customer.component";

import { TransactionManagementModule } from "../transaction-management/transaction-management.module";
@NgModule({
  declarations: [
    AddCustomerComponent,
    CloneCustomerComponent,
    TranslateCustomerComponent,
    ListCustomerComponent,
    SubCustomerComponent,
    DetailCustomerComponent,
  ],
  imports: [
    SharedModule,
    CustomerManagementRoutingModule,
    TransactionManagementModule,
  ],
  exports: [SubCustomerComponent],
  providers: [CustomerResolver],
})
export class CustomerManagementModule {}
