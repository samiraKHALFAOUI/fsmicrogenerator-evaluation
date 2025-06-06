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
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { GroupService } from "../../services/AccountManagement/group.service";

@Injectable({
  providedIn: "root",
})
export class UserResolver implements Resolve<any> {
  result!: Observable<User[] | User | any>;

  domains: string[] = ["fonction"];

  constructor(
    private userService: UserService,
    private domainService: DomainService,
    private groupService: GroupService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.userService.getUsers().pipe(
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
      } else if (route.data["type"] === "detail") {
        return forkJoin({
          data: this.getData(route.params["id"]),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
      } else {
        return forkJoin({
          data: this.getData(route.params["id"]),
          domaines: this.getDomains(),
          groups: this.getGroupes(),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
      }
    } else
      return forkJoin({
        domaines: this.getDomains(),
        groups: this.getGroupes(),
      }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
  getData(id: string): Observable<User | Object> {
    return this.userService.getUserById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<User | Object> {
    return this.userService.getUserForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  getGroupes() {
    return this.groupService.getGroups().pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDomains(): Observable<any> {
    return this.domainService.getDomainsByCode(this.domains).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
