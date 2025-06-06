import { Injectable } from "@angular/core";
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  inventoryUrl = `/inventoryManagementService/inventories`;
  type: any = ["code_18416", "code_18417"];
  constructor(private apiService: APIService, private helpers: HelpersService) {
    //translate i18n values for dropdown options
    Promise.all(
      [this.helpers.translateValues(this.type)]
    )
      .then((result) => {
        this.type = result[0];
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getInventorys(params?: { [key: string]: any }) {
    return this.apiService.get<Inventory[]>(
      `${this.inventoryUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getInventoryById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Inventory>(
      `${this.inventoryUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneInventory(params?: { [key: string]: any }) {
    return this.apiService.get<Inventory>(
      `${this.inventoryUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesInventory(configuration: any) {
    return this.apiService.post<any>(
      `${this.inventoryUrl}/statistiques`,
      configuration
    );
  }

  addInventory(inventory: any) {
    return this.apiService.post<Inventory>(`${this.inventoryUrl}`, inventory);
  }

  addManyInventory(inventory: any) {
    return this.apiService.post<Inventory[]>(
      `${this.inventoryUrl}/many`,
      inventory
    );
  }

  updateInventory(id: string, inventory: any) {
    return this.apiService.patch<{ message: string; data: Inventory }>(
      `${this.inventoryUrl}/${id}`,
      inventory
    );
  }

  updateManyInventory(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.inventoryUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.inventoryUrl}/`,
      data
    );
  }
}
