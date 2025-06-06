import { Injectable } from "@angular/core";
import { Currency } from "src/app/shared/models/CurrencyManagement/Currency.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class CurrencyService {
  currencyUrl = `/currencyManagementService/currencies`;
  typeCurrency: any = ["code_3630", "code_3631"];
  currencies : Currency []= []
  nationalCurrency !: Currency
  constructor(private apiService: APIService, private helpers: HelpersService) {
    this.getCurrencies().subscribe({
      next: (results) => {
        this.currencies.splice(0, this.currencies.length, ...results)
        this.nationalCurrency = this.currencies.find((c)=>c.typeCurrency === 'code_3630' ) || this.currencies[0]
      },
      error: (error) => {

      }
    })
    //translate i18n values for dropdown options
    Promise.all(
      [this.helpers.translateValues(this.typeCurrency)]
    )
      .then((result) => {
        this.typeCurrency.splice(0, this.typeCurrency.length, ...result[0]);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getCurrencies(params?: { [key: string]: any }) {
    return this.apiService.get<Currency[]>(
      `${this.currencyUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getCurrencyById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Currency>(
      `${this.currencyUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  addCurrency(currency: any) {
    return this.apiService.post<Currency>(`${this.currencyUrl}`, currency);
  }

  addManyCurrency(currency: any) {
    return this.apiService.post<Currency[]>(`${this.currencyUrl}/many`, currency);
  }

  getCurrencyForTranslation(id: string) {
    return this.apiService.get<Currency>(`${this.currencyUrl}/translate/${id}`);
  }

  translateCurrency(id: string, currency: any) {
    return this.apiService.patch<{ message: string; data: Currency }>(
      `${this.currencyUrl}/translate/${id}`,
      currency
    );
  }

  updateCurrency(id: string, currency: any) {
    return this.apiService.patch<{ message: string; data: Currency }>(
      `${this.currencyUrl}/${id}`,
      currency
    );
  }

  updateManyCurrency(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.currencyUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.currencyUrl}/`,
      data
    );
  }
  getOneCurrency(params?: { [key: string]: any }) {
    return this.apiService.get<Currency>(
      `${this.currencyUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }
  getStatistiquesCurrency(configuration: any) {
    return this.apiService.post<any>(
      `${this.currencyUrl}/statistiques`,
      configuration
    );
  }
}
