import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Transaction } from "../models/transaction/transaction.model";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class TransactionService {
  constructor(private apiService: ApiService) {}

  addTransaction(product: Transaction): Observable<Transaction> {
    return this.apiService.post<Transaction>("transaction", product);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.apiService.get<Transaction>(`transaction/${id}`);
  }
  getAllTransactions(): Observable<Transaction[]> {
    return this.apiService.get<Transaction[]>("transaction");
  }

  updateTransactionById(
    id: string,
    transaction: Partial<Transaction>
  ): Observable<Transaction> {
    return this.apiService.patch<Transaction>(`transaction/${id}`, transaction);
  }

  getNestedObjectId(obj: any, keys: string[]): any {
    const clone = { ...obj };
    keys.forEach((key) => {
      if (clone[key] && typeof clone[key] === "object" && clone[key]._id) {
        clone[key] = clone[key]._id;
      }
    });
    return clone;
  }
}
