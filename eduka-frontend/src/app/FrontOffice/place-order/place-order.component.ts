import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, CreateOrderRequest, MenuItem } from '../../services/order.service';

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
  userId: number = 1; // TODO: Get from authentication service
  deliveryAddress: string = '';
  notes: string = '';
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cartData = sessionStorage.getItem('cart');
    const restId = sessionStorage.getItem('restaurantId');
    
    if (cartData && restId) {
      this.cart = JSON.parse(cartData);
      this.restaurantId = Number(restId);
    } else {
      this.router.navigate(['/restaurants']);
    }
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }

  submitOrder(): void {
    if (!this.deliveryAddress.trim()) {
      alert('Please enter a delivery address');
      return;
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

    this.orderService.createOrder(orderRequest).subscribe({
      next: () => {
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('restaurantId');
        alert('Order placed successfully!');
        this.router.navigate(['/my-orders']);
      },
      error: (error: any) => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/restaurants']);
  }
}
