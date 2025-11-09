import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order, OrderStatus } from '../../services/order.service';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';

@Component({
  selector: 'app-order-management-back',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management-back.component.html',
  styleUrls: ['./order-management-back.component.css']
})
export class OrderManagementBackComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  restaurants: Restaurant[] = [];
  selectedOrder: Order | null = null;
  showDetailModal = false;
  
  // Filters
  filterStatus: OrderStatus | '' = '';
  filterRestaurantId: number | null = null;
  searchTerm = '';
  
  // Statistics
  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  completedOrders = 0;

  orderStatuses = Object.values(OrderStatus);

  constructor(
    private orderService: OrderService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadOrders();
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (error) => console.error('Error loading restaurants:', error)
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        this.calculateStatistics();
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;
      const matchesRestaurant = !this.filterRestaurantId || order.restaurant === this.filterRestaurantId;
      const matchesSearch = !this.searchTerm || 
                           order.id?.toString().includes(this.searchTerm) ||
                           order.userId.toString().includes(this.searchTerm);
      return matchesStatus && matchesRestaurant && matchesSearch;
    });
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalOrders = this.filteredOrders.length;
    this.totalRevenue = this.filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    this.pendingOrders = this.filteredOrders.filter(o => 
      o.status === OrderStatus.PENDING || 
      o.status === OrderStatus.CONFIRMED || 
      o.status === OrderStatus.PREPARING
    ).length;
    this.completedOrders = this.filteredOrders.filter(o => 
      o.status === OrderStatus.COMPLETED
    ).length;
  }

  updateOrderStatus(orderId: number, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.loadOrders();
        alert(`Order status updated to ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    });
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
    const statusClasses: { [key in OrderStatus]: string } = {
      [OrderStatus.PENDING]: 'bg-warning',
      [OrderStatus.CONFIRMED]: 'bg-info',
      [OrderStatus.PREPARING]: 'bg-primary',
      [OrderStatus.READY]: 'bg-success',
      [OrderStatus.DELIVERED]: 'bg-dark',
      [OrderStatus.COMPLETED]: 'bg-success',
      [OrderStatus.CANCELLED]: 'bg-danger'
    };
    return statusClasses[status];
  }

  getRestaurantName(restaurantId: number): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : `Restaurant #${restaurantId}`;
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
          alert('Order deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          alert('Failed to delete order');
        }
      });
    }
  }

  exportOrders(): void {
    const dataStr = JSON.stringify(this.filteredOrders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString()}.json`;
    link.click();
  }
}
