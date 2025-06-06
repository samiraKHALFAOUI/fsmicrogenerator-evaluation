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
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { Domain } from "src/app/shared/models/TaxonomyManagement/Domain.model";

@Injectable({
  providedIn: "root",
})
export class DomainResolver implements Resolve<any> {
  result!: Observable<Domain[] | Domain | any>;

  constructor(private domainService: DomainService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.domainService.getDomains().pipe(
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
  getData(id: string): Observable<Domain | Object> {
    return this.domainService.getDomainById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<Domain | Object> {
    return this.domainService.getDomainForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
