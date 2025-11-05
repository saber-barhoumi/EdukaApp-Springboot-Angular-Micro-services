import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { UserService, User } from '../../services/user.service';

// Order interface
export interface Order {
  id?: number;
  userId: number;
  restaurantId: number;
  totalAmount?: number;
  status: string;
  orderDate?: Date;
  items?: any[];
}

@Component({
  selector: 'app-restaurant-management-back',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-management-back.component.html',
  styleUrls: ['./restaurant-management-back.component.css']
})
export class RestaurantManagementBackComponent implements OnInit {
  // Tab management
  activeTab: string = 'restaurants';

  // Restaurant management
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  selectedRestaurant: Restaurant | null = null;
  isEditing = false;
  showModal = false;
  searchTerm = '';
  filterType = '';

  newRestaurant: Restaurant = {
    name: '',
    address: '',
    type: '',
    description: '',
    phoneNumber: '',
    email: '',
    openingHours: '',
    imageUrl: '',
    isActive: true
  };

  // Order management
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderSearchTerm = '';
  filterStatus = '';
  filterRestaurantId: number | null = null;
  orderStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
  
  // Order statistics
  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  completedOrders = 0;

  // User management
  allUsers: User[] = [];
  showUserModal = false;
  selectedRestaurantId: number | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = data;
      },
      error: (error) => console.error('Error loading restaurants:', error)
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  // ===================== ORDER MANAGEMENT METHODS =====================
  
  loadOrders(): void {
    // Mock data for now - replace with actual API call
    // this.orderService.getAllOrders().subscribe(...)
    this.orders = this.generateMockOrders();
    this.filteredOrders = [...this.orders];
    this.calculateStatistics();
  }

  generateMockOrders(): Order[] {
    // Generate mock orders - replace with actual API call
    const mockOrders: Order[] = [];
    for (let i = 1; i <= 50; i++) {
      const restaurantId = this.restaurants[Math.floor(Math.random() * this.restaurants.length)]?.id || 1;
      mockOrders.push({
        id: i,
        userId: Math.floor(Math.random() * 100) + 1,
        restaurantId: restaurantId,
        totalAmount: Math.random() * 100 + 10,
        status: this.orderStatuses[Math.floor(Math.random() * this.orderStatuses.length)],
        orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    return mockOrders;
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.orderSearchTerm || 
        order.id?.toString().includes(this.orderSearchTerm) ||
        order.userId.toString().includes(this.orderSearchTerm);
      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;
      const matchesRestaurant = !this.filterRestaurantId || order.restaurantId === this.filterRestaurantId;
      return matchesSearch && matchesStatus && matchesRestaurant;
    });
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalOrders = this.filteredOrders.length;
    this.totalRevenue = this.filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    this.pendingOrders = this.filteredOrders.filter(o => o.status === 'PENDING').length;
    this.completedOrders = this.filteredOrders.filter(o => o.status === 'DELIVERED').length;
  }

  updateOrderStatus(order: Order): void {
    // Mock implementation - replace with actual API call
    console.log('Updating order status:', order);
    alert(`Order #${order.id} status updated to ${order.status}`);
    this.calculateStatistics();
  }

  viewOrderDetails(order: Order): void {
    alert(`Order Details:\nID: ${order.id}\nUser: ${order.userId}\nRestaurant: ${this.getRestaurantName(order.restaurantId)}\nTotal: $${order.totalAmount?.toFixed(2)}\nStatus: ${order.status}`);
  }

  getRestaurantName(restaurantId: number): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant?.name || 'Unknown';
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'bg-warning',
      'CONFIRMED': 'bg-info',
      'PREPARING': 'bg-primary',
      'READY': 'bg-success',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  // ===================== USER ASSIGNMENT METHODS =====================
  
  loadUsersForRestaurant(): void {
    if (this.selectedRestaurantId) {
      // Reload restaurant data to get updated assignments
      this.restaurantService.getRestaurant(this.selectedRestaurantId).subscribe({
        next: (restaurant: Restaurant) => {
          this.selectedRestaurant = restaurant;
        },
        error: (error: any) => console.error('Error loading restaurant:', error)
      });
    }
  }

  filterRestaurants(): void {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           restaurant.address?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.filterType || restaurant.type === this.filterType;
      return matchesSearch && matchesType;
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.newRestaurant = {
      name: '',
      address: '',
      type: '',
      description: '',
      phoneNumber: '',
      email: '',
      openingHours: '',
      imageUrl: '',
      isActive: true
    };
    this.showModal = true;
  }

  openEditModal(restaurant: Restaurant): void {
    this.isEditing = true;
    this.newRestaurant = { ...restaurant };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newRestaurant = {
      name: '',
      address: '',
      type: '',
      description: '',
      phoneNumber: '',
      email: '',
      openingHours: '',
      imageUrl: '',
      isActive: true
    };
  }

  saveRestaurant(): void {
    if (this.isEditing && this.newRestaurant.id) {
      this.restaurantService.updateRestaurant(this.newRestaurant.id, this.newRestaurant).subscribe({
        next: () => {
          this.loadRestaurants();
          this.closeModal();
          alert('Restaurant updated successfully!');
        },
        error: (error) => {
          console.error('Error updating restaurant:', error);
          alert('Failed to update restaurant');
        }
      });
    } else {
      this.restaurantService.createRestaurant(this.newRestaurant).subscribe({
        next: () => {
          this.loadRestaurants();
          this.closeModal();
          alert('Restaurant created successfully!');
        },
        error: (error) => {
          console.error('Error creating restaurant:', error);
          alert('Failed to create restaurant');
        }
      });
    }
  }

  deleteRestaurant(id: number): void {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(id).subscribe({
        next: () => {
          this.loadRestaurants();
          alert('Restaurant deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting restaurant:', error);
          alert('Failed to delete restaurant');
        }
      });
    }
  }

  toggleStatus(restaurant: Restaurant): void {
    const updated = { ...restaurant, isActive: !restaurant.isActive };
    if (restaurant.id) {
      this.restaurantService.updateRestaurant(restaurant.id, updated).subscribe({
        next: () => {
          this.loadRestaurants();
        },
        error: (error) => console.error('Error updating status:', error)
      });
    }
  }

  isUserAssigned(userId: number): boolean {
    if (!this.selectedRestaurant) {
      // When in users tab, check based on selectedRestaurantId
      const restaurant = this.restaurants.find(r => r.id === this.selectedRestaurantId);
      return restaurant?.assignedUserIds?.includes(userId) || false;
    }
    return this.selectedRestaurant?.assignedUserIds?.includes(userId) || false;
  }

  toggleUserAssignment(userId: number): void {
    const restaurantId = this.selectedRestaurantId;
    if (!restaurantId) return;

    const isAssigned = this.isUserAssigned(userId);

    if (isAssigned) {
      this.restaurantService.unassignUser(restaurantId, userId).subscribe({
        next: () => {
          this.loadRestaurants();
          this.loadUsersForRestaurant();
          alert('User unassigned successfully!');
        },
        error: (error: any) => {
          console.error('Error unassigning user:', error);
          alert('Failed to unassign user');
        }
      });
    } else {
      this.restaurantService.assignUser(restaurantId, userId).subscribe({
        next: () => {
          this.loadRestaurants();
          this.loadUsersForRestaurant();
          alert('User assigned successfully!');
        },
        error: (error: any) => {
          console.error('Error assigning user:', error);
          alert('Failed to assign user');
        }
      });
    }
  }

  getRestaurantTypes(): string[] {
    return ['Cafeteria', 'Fast Food', 'Fine Dining', 'Food Court', 'Other'];
  }
}
