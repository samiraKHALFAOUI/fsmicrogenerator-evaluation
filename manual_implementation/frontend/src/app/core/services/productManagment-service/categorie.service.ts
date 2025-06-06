import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Categorie } from '../../models/product-managment/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private apiService: ApiService) {}

  // Get all categories
  getAllCategories(): Observable<Categorie[]> {
    return this.apiService.get('products/categorie');
  }

  // Get category by ID
  getCategoryById(id: string): Observable<any> {
    return this.apiService.get(`products/categorie/${id}`);
  }

  // Create new category
  createCategory(categoryData: any): Observable<any> {
    console.log("🚀 ~ CategorieService ~ createCategory ~ categoryData:", categoryData)
    return this.apiService.post('products/categorie', categoryData);
  }

  // Update category
  updateCategory(id: string, categoryData: any): Observable<any> {
    return this.apiService.put(`products/categorie/${id}`, categoryData);
  }

  // Delete category
  deleteCategory(id: string): Observable<any> {
    return this.apiService.delete(`products/categorie/${id}`);
  }

}
