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
import { ExchangeRateService } from "src/app/shared/services/CurrencyManagement/exchangeRate.service";
import { ExchangeRate } from "src/app/shared/models/CurrencyManagement/ExchangeRate.model";

@Injectable({
  providedIn: "root",
})
export class ExchangeRateResolver implements Resolve<any> {
  result!: Observable<ExchangeRate[] | ExchangeRate | any>;

  constructor(private exchangeRateService: ExchangeRateService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.exchangeRateService.getExchangeRates().pipe(
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
  getData(id: string): Observable<ExchangeRate | Object> {
    return this.exchangeRateService.getExchangeRateById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
