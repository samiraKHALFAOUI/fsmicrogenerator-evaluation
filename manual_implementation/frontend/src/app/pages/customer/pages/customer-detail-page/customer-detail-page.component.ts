import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../../shared/models/customer';
import { CustomerDetailComponent } from '../../components/customer-detail/customer-detail.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-customer-detail-page',
  imports: [
    CustomerDetailComponent,
    ButtonModule,
  ],
  templateUrl: './customer-detail-page.component.html',
  styleUrls: ['./customer-detail-page.component.scss']
})
export class CustomerDetailPageComponent implements OnInit {
  customer: Customer | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.customer = this.route.snapshot.data['customer'];
    
    if (!this.customer) {
      this.router.navigate(['/customers']);
    }
  }
  
  backToList(): void {
    this.router.navigate(['/customers']);
  }
}