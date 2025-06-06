import { Injectable } from "@angular/core";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class TransactionLineService {
  transactionLineUrl = `/transactionManagementService/transactionLines`;

  constructor(private apiService: APIService) {
  }

  getTransactionLines(params?: { [key: string]: any }) {
    return this.apiService.get<TransactionLine[]>(
      `${this.transactionLineUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getTransactionLineById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<TransactionLine>(
      `${this.transactionLineUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneTransactionLine(params?: { [key: string]: any }) {
    return this.apiService.get<TransactionLine>(
      `${this.transactionLineUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesTransactionLine(configuration: any) {
    return this.apiService.post<any>(
      `${this.transactionLineUrl}/statistiques`,
      configuration
    );
  }

  addTransactionLine(transactionLine: any) {
    return this.apiService.post<TransactionLine>(
      `${this.transactionLineUrl}`,
      transactionLine
    );
  }

  addManyTransactionLine(transactionLine: any) {
    return this.apiService.post<TransactionLine[]>(
      `${this.transactionLineUrl}/many`,
      transactionLine
    );
  }

  updateTransactionLine(id: string, transactionLine: any) {
    return this.apiService.patch<{ message: string; data: TransactionLine }>(
      `${this.transactionLineUrl}/${id}`,
      transactionLine
    );
  }

  updateManyTransactionLine(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.transactionLineUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.transactionLineUrl}/`,
      data
    );
  }
}
