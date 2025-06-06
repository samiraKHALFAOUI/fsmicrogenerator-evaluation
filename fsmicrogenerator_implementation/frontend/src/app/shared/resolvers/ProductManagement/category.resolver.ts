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
import { CategoryService } from "src/app/shared/services/ProductManagement/category.service";
import { Category } from "src/app/shared/models/ProductManagement/Category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryResolver implements Resolve<any> {
  result!: Observable<Category[] | Category | any>;

  constructor(private categoryService: CategoryService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    const condition: any = { $or: [{ parentCategory: null }, { parentCategory: { $exists: false } }] }
    if (route.data["type"] === "list") {
      return this.categoryService.getCategorys({condition, options : {queryOptions : {select : '-products'}}}).pipe(
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
        condition['_id'] = { $ne: route.params["id"] }
        return forkJoin({
          data: this.getData(route.params["id"]),
          categories: this.getAllCategories(condition)
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
      }
    } else {
      return forkJoin({
        categories: this.getAllCategories(condition)
      }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
  }
  getData(id: string): Observable<Category | Object> {
    return this.categoryService.getCategoryById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  getAllCategories(condition: any): Observable<Category[] | Object> {
    return this.categoryService.getCategorys({condition, options : {queryOptions: { select: '-products' }}}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  getDataTranslation(id: string): Observable<Category | Object> {
    return this.categoryService.getCategoryForTranslation(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
