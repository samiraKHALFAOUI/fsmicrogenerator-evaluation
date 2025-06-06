import { ExchangeRate } from "./ExchangeRate.model";
export interface Currency {
  _id: string;
  etatObjet: string;
  typeCurrency: string;
  currency: string;
  symbolCurrency: string;
  exchangeRates: ExchangeRate[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
