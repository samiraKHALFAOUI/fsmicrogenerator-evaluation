import { Injectable } from "@angular/core";
import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  productUrl = `/productManagementService/products`;
  status: any = ["code_18398", "code_18399", "code_18400"];
  constructor(private apiService: APIService, private helpers: HelpersService) {
    //translate i18n values for dropdown options
    Promise.all(
      [this.helpers.translateValues(this.status)]
    )
      .then((result) => {
        this.status.splice(0, this.status.length, ...result[0]);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getProducts(params?: { [key: string]: any }) {
    return this.apiService.get<Product[]>(
      `${this.productUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getProductById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Product>(
      `${this.productUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneProduct(params?: { [key: string]: any }) {
    return this.apiService.get<Product>(
      `${this.productUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesProduct(configuration: any) {
    return this.apiService.post<any>(
      `${this.productUrl}/statistiques`,
      configuration
    );
  }

  addProduct(product: any) {
    return this.apiService.post<Product>(`${this.productUrl}`, product);
  }

  addManyProduct(product: any) {
    return this.apiService.post<Product[]>(`${this.productUrl}/many`, product);
  }

  getProductForTranslation(id: string) {
    return this.apiService.get<Product>(`${this.productUrl}/translate/${id}`);
  }

  translateProduct(id: string, product: any) {
    return this.apiService.patch<{ message: string; data: Product }>(
      `${this.productUrl}/translate/${id}`,
      product
    );
  }

  updateProduct(id: string, product: any) {
    return this.apiService.patch<{ message: string; data: Product }>(
      `${this.productUrl}/${id}`,
      product
    );
  }

  updateManyProduct(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.productUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.productUrl}/`,
      data
    );
  }
}
