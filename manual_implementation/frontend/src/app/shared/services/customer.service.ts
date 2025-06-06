import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Customer,
  CustomerParams,
  CustomerResponse,
  CustomersResponse,
} from "../models/customer";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  // Create a new customer with photo
  createCustomer(
    customer: Customer,
    photoFile?: File
  ): Observable<CustomerResponse> {
    // If there's a photo file, use FormData
    if (photoFile) {
      const formData = new FormData();

      // Add all customer data to form data - ensure string conversion for all fields
      Object.keys(customer).forEach((key) => {
        if (customer[key] !== undefined && customer[key] !== null) {
          // Convert all values to strings to ensure proper FormData handling
          formData.append(key, String(customer[key]));
        }
      });

      // Add photo file
      formData.append("photo", photoFile);

      return this.http.post<CustomerResponse>(this.apiUrl, formData);
    }

    // If no photo file, proceed as before
    return this.http.post<CustomerResponse>(this.apiUrl, customer);
  }

  // Update an existing customer with photo
  updateCustomer(
    id: string,
    customer: Customer,
    photoFile?: File
  ): Observable<CustomerResponse> {
    // If there's a photo file, use FormData

    if (photoFile) {
      const formData = new FormData();

      // Add all customer data to form data - ensure string conversion
      Object.keys(customer).forEach((key) => {
        if (
          customer[key] !== undefined &&
          customer[key] !== null &&
          key !== "photo"
        ) {
          // Convert values to strings
          formData.append(key, String(customer[key]));
        }
      });

      // Add photo file
      formData.append("photo", photoFile);

      return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, formData);
    }

    // If we're keeping the existing photo or removing it
    const customerData = { ...customer };

    return this.http.put<CustomerResponse>(
      `${this.apiUrl}/${id}`,
      customerData
    );
  }

  // Get all customers with pagination and sorting
  getCustomers(params: CustomerParams = {}): Observable<CustomersResponse> {
    let httpParams = new HttpParams();

    if (params.page)
      httpParams = httpParams.set("page", params.page.toString());
    if (params.limit)
      httpParams = httpParams.set("limit", params.limit.toString());
    if (params.sortField)
      httpParams = httpParams.set("sortField", params.sortField);
    if (params.sortOrder)
      httpParams = httpParams.set("sortOrder", params.sortOrder);
    if (params.search) httpParams = httpParams.set("search", params.search);

    return this.http.get<CustomersResponse>(this.apiUrl, {
      params: httpParams,
    });
  }

  // Get customer by ID
  getCustomer(id: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${id}`);
  }

  // // // Create a new customer
  // createCustomer(customer: Customer): Observable<CustomerResponse> {
  //   return this.http.post<CustomerResponse>(this.apiUrl, customer);
  // }

  // // Update an existing customer
  // updateCustomer(id: string, customer: Customer): Observable<CustomerResponse> {
  //   return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, customer);
  // }

  // Delete a customer
  deleteCustomer(
    id: string
  ): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}
