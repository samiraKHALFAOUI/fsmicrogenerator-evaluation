import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/productManagment-service/products.service';
import { Product } from '../../core/models/product-managment/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="page-header slide-in">
        <h1>Product Catalog</h1>
        <p>Manage your product inventory across all services</p>
      </header>
      
      <div class="product-grid fade-in">
        <div *ngFor="let product of products" class="product-card">
          <div class="product-image">
            <div class="product-status" [ngClass]="{'in-stock': product.inStock, 'out-of-stock': !product.inStock}">
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </div>
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-meta">
              <span class="product-price">{{ product.price.toFixed(2) }}</span>
              <span class="product-category">{{ product.category }}</span>
            </div>
            <div class="product-actions">
              <button class="btn btn-primary">Edit</button>
              <button class="btn btn-secondary">View Details</button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="products.length === 0" class="empty-state fade-in">
        <h2>No products found</h2>
        <p>Add products to your catalog or try a different search term</p>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: var(--space-4);
    }
    
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: var(--space-2);
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-4);
    }
    
    .product-card {
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
    
    .product-image {
      height: 200px;
      background-color: var(--neutral-200);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .product-status {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .in-stock {
      background-color: var(--success-500);
      color: white;
    }
    
    .out-of-stock {
      background-color: var(--error-500);
      color: white;
    }
    
    .product-details {
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .product-name {
      font-size: 1.25rem;
      margin-bottom: var(--space-1);
    }
    
    .product-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
      flex: 1;
    }
    
    .product-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }
    
    .product-price {
      font-weight: 600;
      font-size: 1.125rem;
      color: var(--primary-600);
    }
    
    .product-category {
      background-color: var(--neutral-100);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      color: var(--neutral-700);
    }
    
    .product-actions {
      display: flex;
      gap: var(--space-2);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-6);
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .empty-state h2 {
      font-size: 1.5rem;
      margin-bottom: var(--space-2);
      color: var(--neutral-700);
    }
    
    .empty-state p {
      color: var(--neutral-600);
    }
    
    @media (max-width: 576px) {
      .product-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
}