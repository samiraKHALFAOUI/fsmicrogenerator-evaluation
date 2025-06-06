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
import { InventoryService } from "src/app/shared/services/InventoryManagement/inventory.service";
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";

@Injectable({
  providedIn: "root",
})
export class InventoryResolver implements Resolve<any> {
  result!: Observable<Inventory[] | Inventory | any>;

  constructor(private inventoryService: InventoryService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> {
    if (route.data["type"] === "list") {
      return this.inventoryService.getInventorys().pipe(
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
  getData(id: string): Observable<Inventory | Object> {
    return this.inventoryService.getInventoryById(id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
