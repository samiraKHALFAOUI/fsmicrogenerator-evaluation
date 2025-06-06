import { Injectable } from "@angular/core";
import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  transactionUrl = `/transactionManagementService/transactions`;
  type: any = ["code_18440", "code_18441"];
  status: any = [
    "code_1166",
    "code_1167",
    "code_18436",
    "code_18437",
    "code_18438",
    "code_18439",
  ];
  constructor(private apiService: APIService, private helpers: HelpersService) {
    //translate i18n values for dropdown options
    Promise.all(
      [
        this.helpers.translateValues(this.type),
        this.helpers.translateValues(this.status),
      ]
    )
      .then((result) => {
        this.type.splice(0, this.type.length, ...result[0]);
        this.status.splice(0, this.status.length, ...result[1]);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getTransactions(params?: { [key: string]: any }) {
    return this.apiService.get<Transaction[]>(
      `${this.transactionUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getTransactionById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Transaction>(
      `${this.transactionUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneTransaction(params?: { [key: string]: any }) {
    return this.apiService.get<Transaction>(
      `${this.transactionUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesTransaction(configuration: any) {
    return this.apiService.post<any>(
      `${this.transactionUrl}/statistiques`,
      configuration
    );
  }

  addTransaction(transaction: any) {
    return this.apiService.post<Transaction>(
      `${this.transactionUrl}`,
      transaction
    );
  }

  addManyTransaction(transaction: any) {
    return this.apiService.post<Transaction[]>(
      `${this.transactionUrl}/many`,
      transaction
    );
  }

  updateTransaction(id: string, transaction: any) {
    return this.apiService.patch<{ message: string; data: Transaction }>(
      `${this.transactionUrl}/${id}`,
      transaction
    );
  }

  updateManyTransaction(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.transactionUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.transactionUrl}/`,
      data
    );
  }
}
