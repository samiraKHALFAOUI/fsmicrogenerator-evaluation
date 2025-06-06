import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { forkJoin, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { TransactionService } from "src/app/shared/services/TransactionManagement/transaction.service";
import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
import { UserService } from "../../services/AccountManagement/user.service";
import { SupplierService } from "../../services/SupplierManagement/supplier.service";
import { CustomerService } from "../../services/CustomerManagement/customer.service";

@Injectable({
  providedIn: "root",
})
export class TransactionResolver implements Resolve<any> {
  result!: Observable<Transaction[] | Transaction | any>;

  constructor(private transactionService: TransactionService,
    private userService: UserService,
    private supplierService: SupplierService,
    private customerService: CustomerService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    const isPurchase = route.data['option'] === 'purchases'
    if (route.data["type"] === "list") {
      return this.transactionService.getTransactions({ condition: { type: isPurchase ? 'code_18441' : 'code_18440' } }).pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
    } else if (route.params["id"]) {
      return forkJoin({
        data: this.getData(route.params["id"]),
        users: this.getUsers()
      }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    } else return forkJoin({
      users: this.getUsers(),
      actors: isPurchase ? this.getSuppliers() : this.getCustomers()
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  getData(id: string): Observable<Transaction | Object> {
    return this.transactionService.getTransactionById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  getUsers() {
    return this.userService
      .getUsers({ options: { queryOptions: { select: 'translations photo -groupe' } } }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
  getSuppliers() {
    return this.supplierService
      .getSuppliers({ condition: { isActif: true } }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
  getCustomers() {
    return this.customerService
      .getCustomers().pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

}
