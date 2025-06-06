import { Injectable } from "@angular/core";
import { Category } from "src/app/shared/models/ProductManagement/Category.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  categoryUrl = `/productManagementService/categories`;

  constructor(private apiService: APIService) {
  }

  getCategorys(params?: { [key: string]: any }) {
    return this.apiService.get<Category[]>(
      `${this.categoryUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getCategoryById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Category>(
      `${this.categoryUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneCategory(params?: { [key: string]: any }) {
    return this.apiService.get<Category>(
      `${this.categoryUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesCategory(configuration: any) {
    return this.apiService.post<any>(
      `${this.categoryUrl}/statistiques`,
      configuration
    );
  }

  addCategory(category: any) {
    return this.apiService.post<Category>(`${this.categoryUrl}`, category);
  }

  addManyCategory(category: any) {
    return this.apiService.post<Category[]>(
      `${this.categoryUrl}/many`,
      category
    );
  }

  getCategoryForTranslation(id: string) {
    return this.apiService.get<Category>(`${this.categoryUrl}/translate/${id}`);
  }

  translateCategory(id: string, category: any) {
    return this.apiService.patch<{ message: string; data: Category }>(
      `${this.categoryUrl}/translate/${id}`,
      category
    );
  }

  updateCategory(id: string, category: any) {
    return this.apiService.patch<{ message: string; data: Category }>(
      `${this.categoryUrl}/${id}`,
      category
    );
  }

  updateManyCategory(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.categoryUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.categoryUrl}/`,
      data
    );
  }
}
