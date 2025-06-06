import { Component } from '@angular/core';
import { ProductsService } from '../../../../core/services/productManagment-service/products.service';
import { Product } from '../../../../core/models/product-managment/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CategorieService } from '../../../../core/services/productManagment-service/categorie.service';
@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {

  products: Product[] = [];
  categories : any [] = []

  constructor(private productsService: ProductsService , 
    private router: Router,
    private apiService : ApiService,
    private categorieService : CategorieService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe(products => {
      for(let p of products) {
        if(p.image && p.image.startsWith('uploads')) {
          p.image = `${this.apiService.apiUrl}/products/${p.image}`
        }
      }
      this.products = products;
    });
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }


  openAddProductModal() {
    this.router.navigate(['/products/add']);
  }
  viewProduct(productId: string) {
    console.log("🚀 ~ ListProductsComponent ~ viewProduct ~ productId:", productId)
    this.router.navigate(['/products/detail', productId]);
  }

  deleteProduct(productId: string) {
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }
}
