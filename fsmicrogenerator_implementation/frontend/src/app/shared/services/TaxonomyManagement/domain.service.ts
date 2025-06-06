import { Injectable } from "@angular/core";
import { Domain } from "src/app/shared/models/TaxonomyManagement/Domain.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class DomainService {
  domainUrl = `/taxonomyManagementService/domains`;

  constructor(private apiService: APIService) {
  }

  getDomains(params?: { [key: string]: any }) {
    return this.apiService.get<Domain[]>(
      `${this.domainUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getDomainById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Domain>(
      `${this.domainUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getDomainsByCode(domains: string[]) {
    return this.apiService.get(`${this.domainUrl}/domains`,
      {
        domains: JSON.stringify(domains),
      }
    );
  }

  getOneDomain(params?: { [key: string]: any }) {
    return this.apiService.get<Domain>(
      `${this.domainUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesDomain(configuration: any) {
    return this.apiService.post<any>(
      `${this.domainUrl}/statistiques`,
      configuration
    );
  }

  addDomain(domain: any) {
    return this.apiService.post<Domain>(`${this.domainUrl}`, domain);
  }

  addManyDomain(domain: any) {
    return this.apiService.post<Domain[]>(`${this.domainUrl}/many`, domain);
  }

  getDomainForTranslation(id: string) {
    return this.apiService.get<Domain>(`${this.domainUrl}/translate/${id}`);
  }

  translateDomain(id: string, domain: any) {
    return this.apiService.patch<{ message: string; data: Domain }>(
      `${this.domainUrl}/translate/${id}`,
      domain
    );
  }

  updateDomain(id: string, domain: any) {
    return this.apiService.patch<{ message: string; data: Domain }>(
      `${this.domainUrl}/${id}`,
      domain
    );
  }

  updateManyDomain(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.domainUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.domainUrl}/`,
      data
    );
  }
}
