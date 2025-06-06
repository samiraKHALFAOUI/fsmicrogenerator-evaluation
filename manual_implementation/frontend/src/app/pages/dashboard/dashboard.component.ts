import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../core/services/productManagment-service/products.service';
import { TransactionService } from '../../core/services/transaction.service';
import { SupplierService } from '../../shared/services/SupplierService/supplier.service';
import { CustomerService } from '../../shared/services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  services: any[] = [];
  totalRequests = '856,342';
  averageResponseTime = '235';
  errorRate = '1.2';
  activeUsers = '12,847';
  products: any[] = []
  transactions: any[] = []
  suppliers: any[] = []
  customers: any[] = []
  orders: any[] = []

  constructor(
    private productService: ProductsService,
    private transactionService: TransactionService,
    private supplierService: SupplierService,
    private customerService: CustomerService,

  ) {}

  ngOnInit() {
    this.getProducts();
    this.getTransactions();
    this.getSuppliers();
    this.getCustomers();
  }

  navigateToService(route: string) {
    // Navigation will be handled by the router link
  }
  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }
  getTransactions() {
    this.transactionService.getAllTransactions().subscribe((transactions) => {
      this.transactions = transactions;
    });
  }
  getSuppliers() {
    this.supplierService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
    });
  }
  getCustomers() {
    this.customerService.getCustomers().subscribe((customers) => {  
      this.customers = customers.data;
    });
  }

}