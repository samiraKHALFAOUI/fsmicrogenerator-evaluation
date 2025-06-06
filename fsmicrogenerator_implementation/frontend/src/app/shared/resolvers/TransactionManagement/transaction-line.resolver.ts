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
import { TransactionLineService } from "src/app/shared/services/TransactionManagement/transactionLine.service";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";

@Injectable({
  providedIn: "root",
})
export class TransactionLineResolver implements Resolve<any> {
  result!: Observable<TransactionLine[] | TransactionLine | any>;

  constructor(private transactionLineService: TransactionLineService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.transactionLineService.getTransactionLines().pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
    } else if (route.params["id"]) {
      return forkJoin({
        data: this.getData(route.params["id"]),
      }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    } else return of(true);
  }
  getData(id: string): Observable<TransactionLine | Object> {
    return this.transactionLineService.getTransactionLineById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
