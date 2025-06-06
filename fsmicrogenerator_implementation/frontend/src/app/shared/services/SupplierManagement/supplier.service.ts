import { Injectable } from "@angular/core";
import { Supplier } from "src/app/shared/models/SupplierManagement/Supplier.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class SupplierService {
  supplierUrl = `/supplierManagementService/suppliers`;

  constructor(private apiService: APIService) {
  }

  getSuppliers(params?: { [key: string]: any }) {
    return this.apiService.get<Supplier[]>(
      `${this.supplierUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getSupplierById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Supplier>(
      `${this.supplierUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneSupplier(params?: { [key: string]: any }) {
    return this.apiService.get<Supplier>(
      `${this.supplierUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesSupplier(configuration: any) {
    return this.apiService.post<any>(
      `${this.supplierUrl}/statistiques`,
      configuration
    );
  }

  addSupplier(supplier: any) {
    return this.apiService.post<Supplier>(`${this.supplierUrl}`, supplier);
  }

  addManySupplier(supplier: any) {
    return this.apiService.post<Supplier[]>(
      `${this.supplierUrl}/many`,
      supplier
    );
  }

  getSupplierForTranslation(id: string) {
    return this.apiService.get<Supplier>(`${this.supplierUrl}/translate/${id}`);
  }

  translateSupplier(id: string, supplier: any) {
    return this.apiService.patch<{ message: string; data: Supplier }>(
      `${this.supplierUrl}/translate/${id}`,
      supplier
    );
  }

  updateSupplier(id: string, supplier: any) {
    return this.apiService.patch<{ message: string; data: Supplier }>(
      `${this.supplierUrl}/${id}`,
      supplier
    );
  }

  updateManySupplier(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.supplierUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.supplierUrl}/`,
      data
    );
  }
}
