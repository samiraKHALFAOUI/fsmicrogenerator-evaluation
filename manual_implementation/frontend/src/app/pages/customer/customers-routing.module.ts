import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListPageComponent } from './pages/customer-list-page/customer-list-page.component';
import { CustomerDetailPageComponent } from './pages/customer-detail-page/customer-detail-page.component';
import { CustomerResolver } from '../../shared/resolvers/customer.resolver';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';

const routes: Routes = [
  { path: '', component: CustomerListPageComponent },
  { 
    path: 'new', 
    component: CustomerFormComponent,
    resolve: {
      customer: CustomerResolver
    }
  },
  { 
    path: ':id', 
    component: CustomerDetailPageComponent,
    resolve: {
      customer: CustomerResolver
    }
  },
  { 
    path: ':id/edit', 
    component: CustomerFormComponent,
    resolve: {
      customer: CustomerResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }