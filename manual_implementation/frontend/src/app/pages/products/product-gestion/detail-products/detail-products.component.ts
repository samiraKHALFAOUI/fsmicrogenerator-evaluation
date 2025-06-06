import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../core/services/productManagment-service/products.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
@Component({
  selector: 'app-detail-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-products.component.html',
  styleUrl: './detail-products.component.scss'
})
export class DetailProductsComponent {
  product: any;
  productId: string = '';

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productsService.getProductById(this.productId).subscribe({
      next: (product) => {
        console.log("🚀 ~ DetailProductsComponent ~ this.productsService.getProductById ~ product:", product)
        this.product = product;
        if(this.product.image && this.product.image.startsWith('uploads')) {
          this.product.image = `${this.apiService.apiUrl}/products/${this.product.image}`
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/products']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }

}
