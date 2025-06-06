import { Routes } from '@angular/router';
import { SupplierListComponent } from './pages/Supplier-management/supplier-list/supplier-list.component';
import { SupplierDetailComponent } from './pages/Supplier-management/supplier-detail/supplier-detail.component';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/products/product-gestion/list-products/list-products.component').then(m => m.ListProductsComponent)
      },
      {
        path: 'add',
        loadComponent: () => import('./pages/products/product-gestion/add-products/add-products.component').then(m => m.AddProductsComponent) 
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/products/product-gestion/add-products/add-products.component').then(m => m.AddProductsComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./pages/products/product-gestion/detail-products/detail-products.component').then(m => m.DetailProductsComponent)
      }
    ]
  },
 
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/new', component: SupplierDetailComponent },
  { path: 'suppliers/:id/:mode', component: SupplierDetailComponent },
  { path: 'suppliers/:id/edit', component: SupplierDetailComponent },
  { 
    path: 'transaction',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/transaction/list-transaction/list-transaction.component').then(m => m.ListTransactionComponent) 
      },
      { 
        path: 'add-transaction', 
        loadComponent: () => import('./pages/transaction/add-transaction/add-transaction.component').then(m => m.AddTransactionComponent) 
      },
      { 
        path: 'add-transaction', 
        loadComponent: () => import('./pages/transaction/add-transaction/add-transaction.component').then(m => m.AddTransactionComponent) 
      },
      { 
        path: 'add-transaction/:id', 
        loadComponent: () => import('./pages/transaction/add-transaction/add-transaction.component').then(m => m.AddTransactionComponent) 
      },
      // {
      //   path: 'detail/:id',
      //   loadComponent: () => import('./pages/products/detail-products/detail-products.component').then(m => m.DetailProductsComponent)
      // }
    ]
  },

  { 
    path: 'listTransactions', 
    loadComponent: () => import('./pages/transaction/list-transaction/list-transaction.component').then(m => m.ListTransactionComponent) 
  },

  {
    path: 'customers',
    loadChildren: () => import('./pages/customer/customers.module').then(m => m.CustomersModule)
  },
  
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory.component').then(m => m.InventoryComponent)
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];