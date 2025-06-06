import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Inventory } from "../models/inventory.model";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class InventoryService {
  constructor(private apiService: ApiService) {}

  getData(): Observable<Inventory[]> {
    return this.apiService.get<Inventory[]>("inventory");
  }

 
}
