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
import { EnumerationService } from "src/app/shared/services/TechnicalConfiguration/enumeration.service";
import { Enumeration } from "src/app/shared/models/TechnicalConfiguration/Enumeration.model";

@Injectable({
  providedIn: "root",
})
export class EnumerationResolver implements Resolve<any> {
  result!: Observable<Enumeration[] | Enumeration | any>;

  constructor(private enumerationService: EnumerationService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list" || (route.data["type"] === "translate" && !route.params["id"])) {
      let condition = {}
      if (route.data["type"] === "translate") {
        condition = { translate: true }
      }
      return this.enumerationService.getEnumerations(condition).pipe(
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
  getData(id: string): Observable<Enumeration | Object> {
    return this.enumerationService.getEnumerationById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<Enumeration | Object> {
    return this.enumerationService.getEnumerationForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
