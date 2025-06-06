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
import { CustomerService } from "src/app/shared/services/CustomerManagement/customer.service";
import { Customer } from "src/app/shared/models/CustomerManagement/Customer.model";

@Injectable({
  providedIn: "root",
})
export class CustomerResolver implements Resolve<any> {
  result!: Observable<Customer[] | Customer | any>;

  constructor(private customerService: CustomerService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.customerService.getCustomers().pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
    } else if (route.params["id"]) {
      if (route.data["type"] === "translate") {
        return forkJoin({
          data: this.getDataTranslation(route.params["id"]),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
      } else
        return forkJoin({
          data: this.getData(route.params["id"]),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
    } else return of(true);
  }
  getData(id: string): Observable<Customer | Object> {
    return this.customerService.getCustomerById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<Customer | Object> {
    return this.customerService.getCustomerForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
