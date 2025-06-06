import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Product } from "../../models/product-managment/product.model";
import { ApiService } from "../api.service";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  constructor(private apiService: ApiService) {}

  // getProducts(params?: { [key: string]: any }) {
  //   if (
  //     params &&
  //     params["condition"] &&
  //     typeof params["condition"] === "object"
  //   ) {
  //     params["condition"] = JSON.stringify(params["condition"]);
  //   }

  //   const httpParams = new HttpParams({ fromObject: params });

  //   return this.apiService.get<Product[]>("products", httpParams);
  // }

  getProducts(params?: { [key: string]: any }) {
    if (
      params &&
      params["condition"] &&
      typeof params["condition"] === "object"
    ) {
      // Stringify the condition object before sending it
      params["condition"] = JSON.stringify(params["condition"]);
    }

    // Add encoding to the query parameters to ensure special characters are handled
    const httpParams = new HttpParams({
      fromObject: params,
    });

    return this.apiService.get<Product[]>("products", httpParams);
  }

  // getProducts(): Observable<Product[]> {
  //   // This would use the apiService to make the actual HTTP request
  //   // return this.apiService.get<Product[]>('products');

  //   // For demo purposes, returning mock data
  //   // return of([
  //   //   {
  //   //     id: 'p1',
  //   //     name: 'Modern Desk Chair',
  //   //     description: 'Ergonomic office chair with lumbar support and adjustable height.',
  //   //     price: 249.99,
  //   //     category: 'Furniture',
  //   //     inStock: true,
  //   //     stockQuantity: 45,
  //   //     createdAt: new Date('2023-01-10'),
  //   //     updatedAt: new Date('2023-06-15')
  //   //   },
  //   //   {
  //   //     id: 'p2',
  //   //     name: 'Wireless Bluetooth Headphones',
  //   //     description: 'Premium noise-cancelling headphones with 30-hour battery life.',
  //   //     price: 179.99,
  //   //     category: 'Electronics',
  //   //     inStock: true,
  //   //     stockQuantity: 120,
  //   //     createdAt: new Date('2023-02-05'),
  //   //     updatedAt: new Date('2023-05-20')
  //   //   },
  //   //   {
  //   //     id: 'p3',
  //   //     name: 'Stainless Steel Water Bottle',
  //   //     description: 'Vacuum-insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
  //   //     price: 29.99,
  //   //     category: 'Kitchen',
  //   //     inStock: true,
  //   //     stockQuantity: 200,
  //   //     createdAt: new Date('2023-03-15'),
  //   //     updatedAt: new Date('2023-03-15')
  //   //   },
  //   //   {
  //   //     id: 'p4',
  //   //     name: 'Leather Messenger Bag',
  //   //     description: 'Handcrafted genuine leather bag with multiple compartments and laptop sleeve.',
  //   //     price: 159.99,
  //   //     category: 'Accessories',
  //   //     inStock: false,
  //   //     stockQuantity: 0,
  //   //     createdAt: new Date('2023-01-20'),
  //   //     updatedAt: new Date('2023-04-10')
  //   //   },
  //   //   {
  //   //     id: 'p5',
  //   //     name: 'Smart LED Desk Lamp',
  //   //     description: 'Adjustable brightness and color temperature with wireless charging base.',
  //   //     price: 89.99,
  //   //     category: 'Home',
  //   //     inStock: true,
  //   //     stockQuantity: 75,
  //   //     createdAt: new Date('2023-04-05'),
  //   //     updatedAt: new Date('2023-06-01')
  //   //   },
  //   //   {
  //   //     id: 'p6',
  //   //     name: 'Wireless Charging Pad',
  //   //     description: 'Fast-charging compatible with all Qi-enabled devices.',
  //   //     price: 39.99,
  //   //     category: 'Electronics',
  //   //     inStock: true,
  //   //     stockQuantity: 150,
  //   //     createdAt: new Date('2023-05-10'),
  //   //     updatedAt: new Date('2023-06-25')
  //   //   }
  //   // ]);
  //   return this.apiService.get<Product[]>('products');
  // }

  getProductById(id: string): Observable<Product> {
    // This would use the apiService to make the actual HTTP request
    return this.apiService.get<Product>(`products/${id}`);
    // For demo purposes, returning mock data
    // return of({
    //   id: id,
    //   name: 'Modern Desk Chair',
    //   description: 'Ergonomic office chair with lumbar support and adjustable height.',
    //   price: 249.99,
    //   category: 'Furniture',
    //   inStock: true,
    //   stockQuantity: 45,
    //   createdAt: new Date('2023-01-10'),
    //   updatedAt: new Date('2023-06-15')
    // });
  }

  createProduct(product: FormData): Observable<Product> {
    return this.apiService.post<Product>("products", product);
  }

  updateProduct(id: string, product: FormData): Observable<Product> {
    return this.apiService.patch<Product>(`products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    // This would use the apiService to make the actual HTTP request
    return this.apiService.delete<void>(`products/${id}`);

    // For demo purposes, returning void
    // return of(undefined);
  }
}
