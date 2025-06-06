import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  ConfirmationService,
  Footer,
  LazyLoadEvent,
  MessageService,
} from "primeng/api";
import { CustomerListComponent } from "../../components/customer-list/customer-list.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ButtonModule } from "primeng/button";
import { CustomerService } from "../../../../shared/services/customer.service";
import { Customer, CustomerParams } from "../../../../shared/models/customer";
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { CustomerFormComponent } from "../../components/customer-form/customer-form.component";

@Component({
  selector: "app-customer-list-page",
  imports: [
    CustomerListComponent,
    ConfirmDialogModule,
    ButtonModule,
    DynamicDialogModule,
  ],
  standalone: true,
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: "./customer-list-page.component.html",
  styleUrls: ["./customer-list-page.component.scss"],
})
export class CustomerListPageComponent implements OnInit {
  customers: Customer[] = [];
  totalItems = 0;
  loading = false;
  ref: DynamicDialogRef | undefined;

  currentParams: CustomerParams = {
    page: 1,
    limit: 10,
    sortField: "name",
    sortOrder: "asc",
  };

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(event?: LazyLoadEvent): void {
    this.loading = true;

    if (event) {
      this.currentParams.page = (event.first || 0) / (event.rows || 10) + 1;
      this.currentParams.limit = event.rows || 10;

      if (event.sortField) {
        this.currentParams.sortField = event.sortField;
        this.currentParams.sortOrder = event.sortOrder === 1 ? "asc" : "desc";
      }
    }

    this.customerService.getCustomers(this.currentParams).subscribe({
      next: (response) => {
        this.customers = response.data;
        this.totalItems = response.pagination.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  viewCustomer(id: string): void {
    this.router.navigate(["/customers", id]);
  }

  editCustomer(id: string): void {
    this.router.navigate(["/customers", id, "edit"]);
  }

  deleteCustomer(id: string): void {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this customer?",
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-success",
      accept: () => {
        this.loading = true;

        this.customerService.deleteCustomer(id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.message || "Customer deleted successfully",
            });
            this.loadCustomers();
          },
          error: () => {
            this.loading = false;
          },
        });
      },
    });
  }

  createCustomer(): void {
    // this.router.navigate(['/customers/new']);
    this.ref = this.dialogService.open(CustomerFormComponent, {
      header: "Add Customer",
      width: "50vw",
      modal: true,
      contentStyle: { overflow: "auto" },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
      data: {
        mode: "add",
      },
      templates: {
        footer: Footer,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const buttonType = data?.buttonType;
        console.log(data);
        if (data?.data) this.customers.push(data.data);
        console.log(this.customers);
      } else {
      }
      this.messageService.add({ severity: "info", life: 3000 });
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({
        severity: "info",
        summary: "Maximized",
        detail: `maximized: ${value.maximized}`,
      });
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
