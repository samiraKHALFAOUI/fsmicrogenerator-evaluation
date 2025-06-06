import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Menu } from 'src/app/shared/models/TechnicalConfiguration/Menu.model';
import { MenuService } from 'src/app/shared/services/TechnicalConfiguration/menu.service';

@Injectable({
  providedIn: 'root',
})
export class MenuResolver implements Resolve<any> {
  result!: Observable<Menu[] | Menu | any>;

  constructor(private menuService: MenuService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data['type'] === 'list') {
      return this.menuService
        .getMenus({
          condition: {
            type: route.data['option'],
          },
        })
        .pipe(
          catchError((error) => {
            return of(error.error);
          })
        );
    } else if (route.params['id']) {
      if (route.data['type'] === 'translate') {
        return forkJoin({
          data: this.getDataTranslation(route.params['id']),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
      } else
        return forkJoin({
          data: this.getData(route.params['id']),
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
    } else return of(true);
  }
  getData(id: string): Observable<Menu | Object> {
    return this.menuService.getMenuById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<Menu | Object> {
    return this.menuService.getMenuForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
