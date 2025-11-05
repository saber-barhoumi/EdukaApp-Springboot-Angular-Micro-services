import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { UserService, User } from '../../services/user.service';
import { OrderService, Order, OrderStatus } from '../../services/order.service';

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
  orderStatuses = Object.values(OrderStatus);
  
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
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    console.log('Loading restaurants...');
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        console.log('Restaurants loaded from database:', data);
        console.log('Total restaurants:', data.length);
        this.restaurants = data;
        this.filteredRestaurants = data;
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
        alert('Failed to load restaurants: ' + (error.error?.message || error.message));
      }
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
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        // Fallback to empty array if error
        this.orders = [];
        this.filteredOrders = [];
        this.calculateStatistics();
      }
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.orderSearchTerm || 
        order.id?.toString().includes(this.orderSearchTerm) ||
        order.userId.toString().includes(this.orderSearchTerm);
      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;
      const matchesRestaurant = !this.filterRestaurantId || order.restaurant?.id === this.filterRestaurantId;
      return matchesSearch && matchesStatus && matchesRestaurant;
    });
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalOrders = this.filteredOrders.length;
    this.totalRevenue = this.filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    this.pendingOrders = this.filteredOrders.filter(o => o.status === OrderStatus.PENDING).length;
    this.completedOrders = this.filteredOrders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.DELIVERED).length;
  }

  updateOrderStatus(order: Order): void {
    if (!order.id || !order.status) return;
    
    this.orderService.updateOrderStatus(order.id, order.status as OrderStatus).subscribe({
      next: () => {
        alert(`Order #${order.id} status updated to ${order.status}`);
        this.loadOrders(); // Reload to get updated data
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status: ' + (error.error?.message || error.message));
        this.loadOrders(); // Reload to reset any changes
      }
    });
  }

  viewOrderDetails(order: Order): void {
    if (!order.id) return;
    
    this.orderService.getOrderWithItems(order.id).subscribe({
      next: (fullOrder) => {
        const itemsList = fullOrder.items?.map(item => `- ${item.name} ($${item.price})`).join('\n') || 'No items';
        alert(`Order Details:\nID: ${fullOrder.id}\nUser: ${fullOrder.userId}\nRestaurant: ${this.getRestaurantName(fullOrder.restaurant?.id)}\nItems:\n${itemsList}\nTotal: $${fullOrder.totalAmount?.toFixed(2)}\nStatus: ${fullOrder.status}`);
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        alert('Failed to load order details');
      }
    });
  }

  getRestaurantName(restaurantId: number | undefined): string {
    if (!restaurantId) return 'Unknown';
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant?.name || 'Unknown';
  }

  getStatusClass(status: string | OrderStatus | undefined): string {
    if (!status) return 'bg-secondary';
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'bg-warning',
      'CONFIRMED': 'bg-info',
      'PREPARING': 'bg-primary',
      'READY': 'bg-success',
      'DELIVERED': 'bg-success',
      'COMPLETED': 'bg-success',
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
        next: (updatedRestaurant) => {
          console.log('Restaurant updated:', updatedRestaurant);
          // Update the restaurant in the local array immediately
          const index = this.restaurants.findIndex(r => r.id === updatedRestaurant.id);
          if (index !== -1) {
            this.restaurants[index] = updatedRestaurant;
            this.filterRestaurants(); // Re-apply filters
          }
          this.closeModal();
          alert('Restaurant updated successfully!');
        },
        error: (error) => {
          console.error('Error updating restaurant:', error);
          alert('Failed to update restaurant: ' + (error.error?.message || error.message));
        }
      });
    } else {
      this.restaurantService.createRestaurant(this.newRestaurant).subscribe({
        next: (createdRestaurant) => {
          console.log('Restaurant created:', createdRestaurant);
          // Add the new restaurant to the local array immediately
          this.restaurants.push(createdRestaurant);
          this.filterRestaurants(); // Re-apply filters to include the new restaurant
          this.closeModal();
          alert('Restaurant created successfully! ID: ' + createdRestaurant.id);
        },
        error: (error) => {
          console.error('Error creating restaurant:', error);
          alert('Failed to create restaurant: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  deleteRestaurant(id: number): void {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(id).subscribe({
        next: () => {
          console.log('Restaurant deleted:', id);
          // Remove from local array immediately
          this.restaurants = this.restaurants.filter(r => r.id !== id);
          this.filterRestaurants(); // Re-apply filters
          alert('Restaurant deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting restaurant:', error);
          alert('Failed to delete restaurant: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  toggleStatus(restaurant: Restaurant): void {
    const updated = { ...restaurant, isActive: !restaurant.isActive };
    if (restaurant.id) {
      this.restaurantService.updateRestaurant(restaurant.id, updated).subscribe({
        next: (updatedRestaurant) => {
          console.log('Restaurant status updated:', updatedRestaurant);
          // Update in local array
          const index = this.restaurants.findIndex(r => r.id === updatedRestaurant.id);
          if (index !== -1) {
            this.restaurants[index] = updatedRestaurant;
            this.filterRestaurants();
          }
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status: ' + (error.error?.message || error.message));
        }
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
