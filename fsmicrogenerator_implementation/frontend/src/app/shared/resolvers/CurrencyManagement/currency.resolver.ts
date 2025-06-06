import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrencyService } from 'src/app/shared/services/CurrencyManagement/currency.service';
import { Currency } from 'src/app/shared/models/CurrencyManagement/Currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyResolver implements Resolve<any> {
  result!: Observable<Currency[] | Currency | any>;
  constructor(
    private currencyService: CurrencyService,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data['type'] === 'list') {
      return this.currencyService.getCurrencies().pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
    } else if (route.params['id']) {
        return forkJoin({
          data: this.getData(route.params['id']),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
    } else
      return of(true)
  }
  getData(id: string): Observable<Currency | Object> {
    return this.currencyService.getCurrencyById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
