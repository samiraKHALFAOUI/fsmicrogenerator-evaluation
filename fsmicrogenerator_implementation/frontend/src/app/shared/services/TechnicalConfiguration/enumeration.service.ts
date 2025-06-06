import { Injectable } from "@angular/core";
import { Enumeration } from "src/app/shared/models/TechnicalConfiguration/Enumeration.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class EnumerationService {
  enumerationUrl = `/technicalConfigurationService/enumerations`;
  etatValidation: any = ["code_223", "code_4268", "code_1407"];
  enumerationData: any = [];
  constructor(private apiService: APIService) {
    this.getEnumerations().subscribe({
      next: (result) => {
        this.enumerationData = result;
      },
      error: (error) => {
        console.error("error get enumeration from service====>", error);
      },
    });
  }

  loadEnumeration() {
    return this.apiService.get<Enumeration[]>(`${this.enumerationUrl}/load`);
  }
  generateEnumeration() {
    return this.apiService.get<any>(`${this.enumerationUrl}/generate`);
  }

  addMissingValues(enumeration: any[]) {
    return this.apiService.post<Enumeration[]>(
      `${this.enumerationUrl}/generate`,
      enumeration
    );
  }

  filterEnumeration() {
    return this.apiService.get<any>(`${this.enumerationUrl}/filter`);
  }

  deleteUnusedValue(enumeration: string[]) {
    return this.apiService.post<any>(
      `${this.enumerationUrl}/filter`,
      enumeration
    );
  }

  getEnumerations(params?: { [key: string]: any }) {
    return this.apiService.get<Enumeration[]>(
      `${this.enumerationUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getEnumerationById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Enumeration>(
      `${this.enumerationUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  addEnumeration(enumeration: any) {
    return this.apiService.post<Enumeration>(
      `${this.enumerationUrl}`,
      enumeration
    );
  }

  addManyEnumeration(enumeration: any) {
    return this.apiService.post<Enumeration[]>(
      `${this.enumerationUrl}/many`,
      enumeration
    );
  }

  getEnumerationForTranslation(id: string) {
    return this.apiService.get<Enumeration>(
      `${this.enumerationUrl}/translate/${id}`
    );
  }

  translateEnumeration(id: string, enumeration: any) {
    return this.apiService.patch<{ message: string; data: Enumeration }>(
      `${this.enumerationUrl}/translate/${id}`,
      enumeration
    );
  }

  updateEnumeration(id: string, enumeration: any) {
    return this.apiService.patch<{ message: string; data: Enumeration }>(
      `${this.enumerationUrl}/${id}`,
      enumeration
    );
  }

  updateManyEnumeration(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.enumerationUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.enumerationUrl}/`,
      data
    );
  }
  getOneEnumeration(params?: { [key: string]: any }) {
    return this.apiService.get<Enumeration>(
      `${this.enumerationUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }
  getStatistiquesEnumeration(configuration: any) {
    return this.apiService.post<any>(
      `${this.enumerationUrl}/statistiques`,
      configuration
    );
  }
}
