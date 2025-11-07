import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { OrderService, Order, OrderStatus } from '../../services/order.service';
import { AuthService } from '../../services/auth-dynamic.service';

declare var $: any;

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit, AfterViewInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  userOrders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  filterType = '';
  orderStatusFilter = '';
  currentUserId: string | null = null;
  activeTab: 'restaurants' | 'orders' = 'restaurants';
  
  restaurantTypes = ['Cafeteria', 'Fast Food', 'Fine Dining', 'Food Court', 'Other'];
  orderStatuses = Object.values(OrderStatus);

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user ID
    const user = this.authService.getCurrentUser();
    if (user && user._id) {
      this.currentUserId = user._id;
      console.log('✅ Current User ID:', this.currentUserId);
    }

    this.loadRestaurants();
    this.loadUserOrders();
  }

  ngAfterViewInit(): void {
    // Initialize Owl Carousel after view is loaded
    setTimeout(() => {
      this.initializeOwlCarousel();
    }, 500);
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        // Only show active restaurants to front-office users
        this.restaurants = data.filter(r => r.isActive);
        this.filteredRestaurants = this.restaurants;
        console.log('📍 Loaded restaurants:', this.restaurants.length);
        // Reinitialize carousel after data loads
        setTimeout(() => {
          this.initializeOwlCarousel();
        }, 100);
      },
      error: (error) => console.error('Error loading restaurants:', error)
    });
  }

  loadUserOrders(): void {
    if (!this.currentUserId) {
      console.log('⚠️ No user logged in');
      return;
    }

    this.orderService.getOrdersByUser(this.currentUserId as any).subscribe({
      next: (data) => {
        this.userOrders = data.sort((a, b) => {
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        });
        this.filteredOrders = this.userOrders;
        console.log('📦 Loaded user orders:', this.userOrders.length);
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  filterRestaurants(): void {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           restaurant.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.filterType || restaurant.type === this.filterType;
      return matchesSearch && matchesType;
    });
    
    // Reinitialize carousel after filtering
    setTimeout(() => {
      this.initializeOwlCarousel();
    }, 100);
  }

  filterOrders(): void {
    this.filteredOrders = this.userOrders.filter(order => {
      const matchesStatus = !this.orderStatusFilter || order.status === this.orderStatusFilter;
      return matchesStatus;
    });
  }

  switchTab(tab: 'restaurants' | 'orders'): void {
    this.activeTab = tab;
    if (tab === 'restaurants') {
      setTimeout(() => {
        this.initializeOwlCarousel();
      }, 100);
    }
  }

  viewRestaurantDetails(restaurantId: number): void {
    this.router.navigate(['/restaurant', restaurantId]);
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/order-details', orderId]);
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'badge-warning',
      'CONFIRMED': 'badge-info',
      'PREPARING': 'badge-primary',
      'READY': 'badge-success',
      'DELIVERED': 'badge-success',
      'COMPLETED': 'badge-success',
      'CANCELLED': 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  getDefaultImage(): string {
    return '/assets/FrontOffice/img/event/event-01.jpg';
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED).subscribe({
        next: () => {
          alert('Order cancelled successfully');
          this.loadUserOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order');
        }
      });
    }
  }

  private initializeOwlCarousel(): void {
    if (typeof $ !== 'undefined' && $('.event-slider').length > 0) {
      // Destroy existing carousel if it exists
      $('.event-slider').trigger('destroy.owl.carousel');
      $('.event-slider').removeClass('owl-loaded');
      $('.event-slider').find('.owl-stage-outer').children().unwrap();
      
      // Initialize new carousel
      $('.event-slider').owlCarousel({
        loop: true,
        margin: 25,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        navText: [
          '<i class="far fa-angle-left"></i>',
          '<i class="far fa-angle-right"></i>'
        ],
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 2
          },
          992: {
            items: 3
          }
        }
      });
    }
  }
}
