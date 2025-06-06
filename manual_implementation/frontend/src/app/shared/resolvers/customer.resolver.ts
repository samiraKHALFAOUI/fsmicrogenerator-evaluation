import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerResolver implements Resolve<Customer | null> {
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Customer | null> {
    const id = route.paramMap.get('id');
    
    if (!id) {
      // If creating a new customer, return empty customer object
      if (route.routeConfig?.path === 'new') {
        return of({
          name: '',
          email: '',
          phoneNumber: '',
          address: ''
        });
      }
      
      this.router.navigate(['/customers']);
      return of(null);
    }

    return this.customerService.getCustomer(id).pipe(
      map(response => response.data),
      catchError(() => {
        this.router.navigate(['/customers']);
        return of(null);
      })
    );
  }
}