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
import { LangueSiteService } from "src/app/shared/services/TechnicalConfiguration/langueSite.service";
import { LangueSite } from "src/app/shared/models/TechnicalConfiguration/LangueSite.model";

@Injectable({
  providedIn: "root",
})
export class LangueSiteResolver implements Resolve<any> {
  result!: Observable<LangueSite[] | LangueSite | any>;

  constructor(private langueSiteService: LangueSiteService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.langueSiteService.getLangueSites({options :{queryOptions :{sort :{ordreAffichage : 1} } } } ).pipe(
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
  getData(id: string): Observable<LangueSite | Object> {
    return this.langueSiteService.getLangueSiteById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<LangueSite | Object> {
    return this.langueSiteService.getLangueSiteForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
