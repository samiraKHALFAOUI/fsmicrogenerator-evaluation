import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TransactionResolver } from "src/app/shared/resolvers/TransactionManagement/transaction.resolver";
import { TransactionLineResolver } from "src/app/shared/resolvers/TransactionManagement/transaction-line.resolver";

import { TransactionManagementRoutingModule } from "./transaction-management-routing.module";
import { AddTransactionComponent } from "./gestion-transaction/add-transaction/add-transaction.component";
import { ListTransactionComponent } from "./gestion-transaction/list-transaction/list-transaction.component";
import { SubTransactionComponent } from "./subComponents/sub-transaction/sub-transaction.component";
import { DetailTransactionComponent } from "./gestion-transaction/detail-transaction/detail-transaction.component";
import { AddTransactionLineComponent } from "./gestion-transaction-line/add-transaction-line/add-transaction-line.component";
import { ListTransactionLineComponent } from "./gestion-transaction-line/list-transaction-line/list-transaction-line.component";
import { SubTransactionLineComponent } from "./subComponents/sub-transaction-line/sub-transaction-line.component";
import { DetailTransactionLineComponent } from "./gestion-transaction-line/detail-transaction-line/detail-transaction-line.component";

import { ProductManagementModule } from "../product-management/product-management.module";
@NgModule({
  declarations: [
    AddTransactionComponent,
    ListTransactionComponent,
    SubTransactionComponent,
    DetailTransactionComponent,
    AddTransactionLineComponent,
    ListTransactionLineComponent,
    SubTransactionLineComponent,
    DetailTransactionLineComponent,
  ],
  imports: [
    SharedModule,
    TransactionManagementRoutingModule,
    ProductManagementModule,
  ],
  exports: [SubTransactionComponent, SubTransactionLineComponent],
  providers: [TransactionResolver, TransactionLineResolver],
})
export class TransactionManagementModule {}
