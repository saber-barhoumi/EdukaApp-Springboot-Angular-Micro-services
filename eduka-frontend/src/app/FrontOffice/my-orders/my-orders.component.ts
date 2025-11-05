import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order, OrderStatus } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  showDetailModal = false;
  filterStatus: OrderStatus | '' = '';
  orderStatuses = Object.values(OrderStatus);
  userId: number = 1; // TODO: Get from authentication service

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = data;
      },
      error: (error: any) => console.error('Error loading orders:', error)
    });
  }

  filterOrders(): void {
    if (this.filterStatus) {
      this.filteredOrders = this.orders.filter(o => o.status === this.filterStatus);
    } else {
      this.filteredOrders = this.orders;
    }
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  getStatusBadgeClass(status: OrderStatus): string {
    const classes: { [key in OrderStatus]: string } = {
      [OrderStatus.PENDING]: 'bg-warning',
      [OrderStatus.CONFIRMED]: 'bg-info',
      [OrderStatus.PREPARING]: 'bg-primary',
      [OrderStatus.READY]: 'bg-success',
      [OrderStatus.DELIVERED]: 'bg-dark',
      [OrderStatus.COMPLETED]: 'bg-success',
      [OrderStatus.CANCELLED]: 'bg-danger'
    };
    return classes[status];
  }
}
