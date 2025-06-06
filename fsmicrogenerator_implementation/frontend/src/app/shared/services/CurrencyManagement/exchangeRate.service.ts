import { Injectable } from "@angular/core";
import { ExchangeRate } from "src/app/shared/models/CurrencyManagement/ExchangeRate.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class ExchangeRateService {
  exchangeRateUrl = `/currencyManagementService/exchangeRates`;
  exchangeRates: ExchangeRate[] = []

  constructor(private apiService: APIService) {
    this.getExchangeRates().subscribe({
      next: (results) => {
        this.exchangeRates.splice(0, this.exchangeRates.length, ...results)
      },
      error: (error) => {

      }
    })
  }
  transformToCurrency(baseCurrency :string, targetCurrency:string, value :number) {
    if(!this.exchangeRates.length || !baseCurrency || !value || !targetCurrency || baseCurrency ==targetCurrency)
      return value
    const exchange = this.exchangeRates.find((e)=>e.actif && [e.refCurrencyBase._id , e.refCurrencyEtrangere._id].includes(baseCurrency) && [e.refCurrencyBase._id , e.refCurrencyEtrangere._id].includes(targetCurrency))
    if(!exchange)
      return value
    else {
      if(exchange.refCurrencyBase._id === baseCurrency)
        return value * exchange.valeurVente
      else
      return value / exchange.valeurVente
    }

  }

  getExchangeRates(params?: { [key: string]: any }) {
    return this.apiService.get<ExchangeRate[]>(
      `${this.exchangeRateUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getExchangeRateById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<ExchangeRate>(
      `${this.exchangeRateUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  addExchangeRate(exchangeRate: any) {
    return this.apiService.post<ExchangeRate>(
      `${this.exchangeRateUrl}`,
      exchangeRate
    );
  }

  addManyExchangeRate(exchangeRate: any) {
    return this.apiService.post<ExchangeRate[]>(
      `${this.exchangeRateUrl}/many`,
      exchangeRate
    );
  }

  updateExchangeRate(id: string, exchangeRate: any) {
    return this.apiService.patch<{ message: string; data: ExchangeRate }>(
      `${this.exchangeRateUrl}/${id}`,
      exchangeRate
    );
  }

  updateManyExchangeRate(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.exchangeRateUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.exchangeRateUrl}/`,
      data
    );
  }
  getOneExchangeRate(params?: { [key: string]: any }) {
    return this.apiService.get<ExchangeRate>(
      `${this.exchangeRateUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }
  getStatistiquesExchangeRate(configuration: any) {
    return this.apiService.post<any>(
      `${this.exchangeRateUrl}/statistiques`,
      configuration
    );
  }
}
