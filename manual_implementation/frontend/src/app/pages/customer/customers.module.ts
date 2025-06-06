import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListPageComponent } from './pages/customer-list-page/customer-list-page.component';
import { CustomerDetailPageComponent } from './pages/customer-detail-page/customer-detail-page.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    CustomerListPageComponent,
    CustomerDetailPageComponent,
    CustomerFormComponent,
    CustomerListComponent,
    CustomerDetailComponent,
  ]
})
export class CustomersModule { }