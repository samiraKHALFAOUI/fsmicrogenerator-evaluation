import { Component } from "@angular/core";
import { Transaction } from "../../../core/models/transaction/transaction.model";
import { TransactionService } from "../../../core/services/transaction.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-transaction",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./list-transaction.component.html",
  styleUrl: "./list-transaction.component.css",
})
export class ListTransactionComponent {
  transactions: Transaction[] = [];
  filteredOrders: Transaction[] = [];
  selectedOrder: Transaction | null = null;

  statusFilter = "all";
  dateFilter = "all";
  searchQuery = "";

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.transactionService.getAllTransactions().subscribe((transactions) => {
      this.transactions = transactions;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.transactions];

    // Apply status filter
    if (this.statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === this.statusFilter);
    }

    // Apply date filter
    if (this.dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (this.dateFilter === "today") {
        filtered = filtered.filter((order) => new Date(order.date) >= today);
      } else if (this.dateFilter === "week") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        filtered = filtered.filter(
          (order) => new Date(order.date) >= weekStart
        );
      } else if (this.dateFilter === "month") {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        filtered = filtered.filter(
          (order) => new Date(order.date) >= monthStart
        );
      }
    }

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      // filtered = filtered.filter(order =>
      //   order.id.toLowerCase().includes(query) ||
      //   order.customerName.toLowerCase().includes(query)
      // );
    }

    this.filteredOrders = filtered;
  }

  viewOrderDetails(order: Transaction) {
    this.selectedOrder = order;
  }

  updateOrderStatus(order: Transaction) {
    // Implement status update functionality
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "new":
        return "status-new";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  }

  calculateSubtotal(order: Transaction): number {
    //return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return 0;
  }

  navigateToAdd() {
    this.router.navigate(["/transaction/add-transaction"]);
  }
  navigateToEdit(id: string) {
    this.router.navigate(["/transaction/add-transaction", id]);
  }
  navigateToDetail(order: any) {
    // this.router.navigate(['/transaction/detail-transaction',id])

    this.selectedOrder = order;
  }
}
