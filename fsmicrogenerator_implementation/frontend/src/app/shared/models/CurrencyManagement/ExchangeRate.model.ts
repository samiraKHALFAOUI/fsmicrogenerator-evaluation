import { Currency } from "./Currency.model";

export interface ExchangeRate {
  _id: string;
  etatObjet: string;
  date: Date | string;
  refCurrencyBase: Currency;
  refCurrencyEtrangere: Currency;
  valeurAchat: number;
  valeurVente: number;
  actif: boolean;
  currency: Currency[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
