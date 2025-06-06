import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Supplier } from '../../models/supplierModel/supplier.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: Supplier, logoFile?: File): Observable<Supplier> {
    // If no file is being uploaded, send as JSON
    // if (!logoFile) {
    //   const supplierData = {
    //     name: supplier.name,
    //     email: supplier.email,
    //     officePhoneNumber: supplier.officePhoneNumber,
    //     address: supplier.address,
    //     isAct: supplier.isAct
    //   };
      
    //   console.log('Sending JSON data:', supplierData);
    //   return this.http.post<Supplier>(this.apiUrl, supplierData).pipe(
    //     tap(response => console.log('Create response:', response))
    //   );
    // }

    // If file is being uploaded, use FormData
    const formData = new FormData();
    
    // Add supplier data
    formData.append('name', supplier.name);
    formData.append('email', supplier.email);
    formData.append('officePhoneNumber', supplier.officePhoneNumber);
    formData.append('address', supplier.address);
    formData.append('isAct', String(supplier.isAct));
    
    // Add logo file with the correct field name
    if(logoFile)
    formData.append('logo', logoFile);

    console.log('Sending FormData:', {
      name: supplier.name,
      email: supplier.email,
      officePhoneNumber: supplier.officePhoneNumber,
      address: supplier.address,
      isAct: supplier.isAct,
      hasLogo: true
    });

    return this.http.post<Supplier>(this.apiUrl, formData).pipe(
      tap(response => console.log('Create response:', response))
    );
  }

  updateSupplier(id: string, supplier: Supplier, logoFile?: File): Observable<Supplier> {


    // If file is being uploaded, use FormData
    const formData = new FormData();
    
    // Add supplier data
    formData.append('name', supplier.name);
    formData.append('email', supplier.email);
    formData.append('officePhoneNumber', supplier.officePhoneNumber);
    formData.append('address', supplier.address);
    formData.append('isAct', String(supplier.isAct));
    
    // Add logo file with the correct field name
    if(logoFile)
    formData.append('logo', logoFile);

    console.log('Sending FormData:', {
      name: supplier.name,
      email: supplier.email,
      officePhoneNumber: supplier.officePhoneNumber,
      address: supplier.address,
      isAct: supplier.isAct,
      hasLogo: true
    });

    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(response => console.log('Update response:', response))
    );
  }

  deleteSupplier(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
} 