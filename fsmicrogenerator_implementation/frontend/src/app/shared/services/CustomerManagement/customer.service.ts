import { Injectable } from "@angular/core";
import { Customer } from "src/app/shared/models/CustomerManagement/Customer.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  customerUrl = `/customerManagementService/customers`;

  constructor(private apiService: APIService) {
  }

  getCustomers(params?: { [key: string]: any }) {
    return this.apiService.get<Customer[]>(
      `${this.customerUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getCustomerById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Customer>(
      `${this.customerUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneCustomer(params?: { [key: string]: any }) {
    return this.apiService.get<Customer>(
      `${this.customerUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesCustomer(configuration: any) {
    return this.apiService.post<any>(
      `${this.customerUrl}/statistiques`,
      configuration
    );
  }

  addCustomer(customer: any) {
    return this.apiService.post<Customer>(`${this.customerUrl}`, customer);
  }

  addManyCustomer(customer: any) {
    return this.apiService.post<Customer[]>(
      `${this.customerUrl}/many`,
      customer
    );
  }

  getCustomerForTranslation(id: string) {
    return this.apiService.get<Customer>(`${this.customerUrl}/translate/${id}`);
  }

  translateCustomer(id: string, customer: any) {
    return this.apiService.patch<{ message: string; data: Customer }>(
      `${this.customerUrl}/translate/${id}`,
      customer
    );
  }

  updateCustomer(id: string, customer: any) {
    return this.apiService.patch<{ message: string; data: Customer }>(
      `${this.customerUrl}/${id}`,
      customer
    );
  }

  updateManyCustomer(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.customerUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.customerUrl}/`,
      data
    );
  }
}
