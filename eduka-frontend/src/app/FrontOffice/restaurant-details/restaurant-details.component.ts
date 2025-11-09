import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { MenuItemService, MenuItem } from '../../services/menu-item.service';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant: Restaurant | null = null;
  menuItems: MenuItem[] = [];
  filteredMenuItems: MenuItem[] = [];
  cart: CartItem[] = [];
  selectedCategory = '';
  categories: string[] = [];
  
  showCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService
  ) {}

  ngOnInit(): void {
    const restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    if (restaurantId) {
      this.loadRestaurant(restaurantId);
      this.loadMenuItems(restaurantId);
    }
  }

  loadRestaurant(id: number): void {
    this.restaurantService.getRestaurant(id).subscribe({
      next: (data: Restaurant) => {
        this.restaurant = data;
      },
      error: (error: any) => console.error('Error loading restaurant:', error)
    });
  }

  loadMenuItems(restaurantId: number): void {
    this.menuItemService.getAvailableMenuItems(restaurantId).subscribe({
      next: (data: MenuItem[]) => {
        this.menuItems = data;
        this.filteredMenuItems = data;
        this.extractCategories();
      },
      error: (error: any) => console.error('Error loading menu items:', error)
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.menuItems.map(item => item.category || 'Other'));
    this.categories = Array.from(categorySet);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category) {
      this.filteredMenuItems = this.menuItems.filter(item => item.category === category);
    } else {
      this.filteredMenuItems = this.menuItems;
    }
  }

  addToCart(menuItem: MenuItem): void {
    const existingItem = this.cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ menuItem, quantity: 1 });
    }
    this.showCart = true;
  }

  removeFromCart(menuItem: MenuItem): void {
    const existingItem = this.cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
      } else {
        this.cart = this.cart.filter(item => item.menuItem.id !== menuItem.id);
      }
    }
  }

  getCartItemQuantity(menuItemId: number | undefined): number {
    if (!menuItemId) return 0;
    const item = this.cart.find(i => i.menuItem.id === menuItemId);
    return item ? item.quantity : 0;
  }

  getCartTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  proceedToCheckout(): void {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Store cart in session storage and navigate to place-order
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
    sessionStorage.setItem('restaurantId', this.restaurant?.id?.toString() || '');
    this.router.navigate(['/place-order']);
  }

  goBack(): void {
    this.router.navigate(['/restaurants']);
  }
}
