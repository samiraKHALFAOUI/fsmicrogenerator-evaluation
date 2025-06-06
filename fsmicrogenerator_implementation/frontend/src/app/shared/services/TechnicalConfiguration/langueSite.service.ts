import { Injectable } from "@angular/core";
import { LangueSite } from "src/app/shared/models/TechnicalConfiguration/LangueSite.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { AuthService } from "../defaultServices/auth.service";

@Injectable({
  providedIn: "root",
})
export class LangueSiteService {
  langueSiteUrl = `/technicalConfigurationService/langueSites`;

  private ordreAffichage: number = 1;
  languages: LangueSite[] = [];
  constructor(
    private apiService: APIService,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn())
      this.apiService
        .get<LangueSite[]>(
          `${this.langueSiteUrl}?params=${JSON.stringify({
            condition: { actif: true },
            options: { queryOptions: { sort: { ordreAffichage: 1 } } },
          })}`
        )
        .subscribe((result) => {
          this.languages.splice(0, this.languages.length, ...result);
        });
  }
  setOrdre(ordre: number) {
    this.ordreAffichage = ordre;
  }

  getOrdre() {
    return this.ordreAffichage;
  }

  getLangueSites(params?: { [key: string]: any }) {
    return this.apiService.get<LangueSite[]>(
      `${this.langueSiteUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getLangueSiteById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<LangueSite>(
      `${this.langueSiteUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneLangueSite(params?: { [key: string]: any }) {
    return this.apiService.get<LangueSite>(
      `${this.langueSiteUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  addLangueSite(langue: any) {
    return this.apiService.post<LangueSite>(`${this.langueSiteUrl}`, langue);
  }

  addManyLangueSite(langue: any) {
    return this.apiService.post<LangueSite[]>(
      `${this.langueSiteUrl}/many`,
      langue
    );
  }

  getLangueSiteForTranslation(id: string) {
    return this.apiService.get<LangueSite>(
      `${this.langueSiteUrl}/translate/${id}`
    );
  }

  translateLangueSite(id: string, langueSite: any) {
    return this.apiService.patch<{ message: string; data: LangueSite }>(
      `${this.langueSiteUrl}/translate/${id}`,
      langueSite
    );
  }

  updateLangueSite(id: string, langue: any) {
    return this.apiService.patch<{ message: string; data: LangueSite }>(
      `${this.langueSiteUrl}/${id}`,
      langue
    );
  }

  updateOrdre(ids: any) {
    return this.apiService.patch<{ message: string }>(
      `${this.langueSiteUrl}/setOrdre`,
      ids
    );
  }

  updateManyLangueSite(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.langueSiteUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.langueSiteUrl}/`,
      data
    );
  }

  getStatistiquesLangueSite(configuration: any) {
    return this.apiService.post<any>(
      `${this.langueSiteUrl}/statistiques`,
      configuration
    );
  }
}
