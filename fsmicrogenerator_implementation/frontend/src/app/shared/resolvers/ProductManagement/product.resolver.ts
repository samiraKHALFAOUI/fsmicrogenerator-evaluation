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
import { ProductService } from "src/app/shared/services/ProductManagement/product.service";
import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { SupplierService } from 'src/app/shared/services/SupplierManagement/supplier.service';
import { CurrencyService } from 'src/app/shared/services/CurrencyManagement/currency.service';
import { CategoryService } from 'src/app/shared/services/ProductManagement/category.service';

@Injectable({
  providedIn: "root",
})
export class ProductResolver implements Resolve<any> {
  result!: Observable<Product[] | Product | any>;

  domains: string[] = ["units"];

  constructor(
    private productService: ProductService,
    private domainService: DomainService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private supplierService: SupplierService

  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.productService.getProducts().pipe(
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
          categories: this.getAllCategories(),
          suppliers: this.getSuppliers()
        }).pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
      }
    } else
      return forkJoin({
        domaines: this.getDomains(),
        categories: this.getAllCategories(),
        suppliers: this.getSuppliers()
      }).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
  getData(id: string): Observable<Product | Object> {
    return this.productService.getProductById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDataTranslation(id: string): Observable<Product | Object> {
    return this.productService.getProductForTranslation(id).pipe(
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

  getSuppliers() {
    return this.supplierService.getSuppliers({ condition: { isActif: true },options : { queryOptions: { select: '-purchases -products' }} }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getAllCategories() {
    return this.categoryService
      .getCategorys({ condition: { $or: [{ parentCategory: null }, { parentCategory: { $exists: false } }] }, options: {queryOptions: { select: '-products' } }})
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

}
