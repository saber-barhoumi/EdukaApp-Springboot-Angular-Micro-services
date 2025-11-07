import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, CreateOrderRequest } from '../../services/order.service';
import { AuthService } from '../../services/auth-dynamic.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  cart: any[] = [];
  restaurantId: number = 0;
  userId: string | number = ''; // Support both MongoDB string and SQL number
  deliveryAddress: string = '';
  notes: string = '';
  isSubmitting: boolean = false;
  
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Debug: Check localStorage directly
    const storedUser = localStorage.getItem('currentUser');
    console.log('=== PlaceOrderComponent ngOnInit ===');
    console.log('localStorage currentUser:', storedUser);
    
    // CRITICAL: If no stored user, this is the problem!
    if (!storedUser) {
      console.error('❌ CRITICAL: No user in localStorage!');
      console.error('This means login did not save the user properly.');
      alert('Session expired. Please login again.');
      this.router.navigate(['/login']);
      return;
    }
    
    // Get user from auth service
    const user = this.authService.getCurrentUser();
    console.log('authService.getCurrentUser():', user);
    
    // Get user ID (supports both MongoDB _id and SQL id)
    const userId = this.authService.getUserId();
    console.log('getUserId():', userId);
    
    if (userId) {
      // Keep the ID as-is (string for MongoDB, number for SQL)
      this.userId = userId;
      console.log('✅ User ID set to:', this.userId);
    } else {
      // If no user is logged in, redirect to login
      console.error('❌ No user ID found! User object:', user);
      alert('Please login to place an order');
      this.router.navigate(['/login']);
      return;
    }

    const cartData = sessionStorage.getItem('cart');
    const restId = sessionStorage.getItem('restaurantId');
    
    console.log('Cart data:', cartData);
    console.log('Restaurant ID:', restId);
    
    if (cartData && restId) {
      this.cart = JSON.parse(cartData);
      this.restaurantId = Number(restId);
      console.log('✅ Cart loaded:', this.cart.length, 'items');
    } else {
      console.warn('No cart data found, redirecting to restaurants');
      this.router.navigate(['/restaurants']);
    }
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }

  submitOrder(): void {
    if (!this.userId) {
      alert('Please login to place an order');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.deliveryAddress.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    if (this.isSubmitting) {
      return; // Prevent double submission
    }

    const menuItemIds: number[] = [];
    this.cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        menuItemIds.push(item.menuItem.id);
      }
    });

    const orderRequest: CreateOrderRequest = {
      userId: this.userId,
      restaurantId: this.restaurantId,
      menuItemIds: menuItemIds,
      notes: this.notes,
      deliveryAddress: this.deliveryAddress
    };

    this.isSubmitting = true;

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('restaurantId');
        
        // 🔔 CREATE NOTIFICATION FOR ORDER CONFIRMATION
        this.notificationService.addNotification({
          id: `order_${Date.now()}`,
          title: '🎉 Order Placed Successfully!',
          message: `Your order #${order.id} has been confirmed. Total: $${order.totalAmount || this.getTotal()}`,
          type: 'success',
          timestamp: new Date(),
          read: false
        });
        
        alert('Order placed successfully! Order ID: ' + order.id);
        this.isSubmitting = false;
        this.router.navigate(['/restaurants']);
      },
      error: (error: any) => {
        console.error('Error placing order:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message,
          error: error.error,
          url: error.url
        });
        this.isSubmitting = false;
        
        // Show specific error message
        let errorMessage = 'Failed to place order. ';
        if (error.error?.message) {
          errorMessage += error.error.message;
        } else if (error.error?.error) {
          errorMessage += error.error.error;
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += 'Please try again.';
        }
        
        // Add hint about backend mismatch
        if (error.status === 500) {
          errorMessage += '\n\nNote: You may be using Node.js backend (MongoDB) with Spring Boot order service (SQL). The userID formats are incompatible.';
        }
        
        alert(errorMessage);
        
        if (error.message && error.message.includes('User not found')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/restaurants']);
  }
}
