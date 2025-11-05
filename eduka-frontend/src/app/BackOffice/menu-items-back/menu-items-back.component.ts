import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenuItemService, MenuItem, CreateMenuItemRequest } from '../../services/menu-item.service';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';

@Component({
  selector: 'app-menu-items-back',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './menu-items-back.component.html',
  styleUrls: ['./menu-items-back.component.css']
})
export class MenuItemsBackComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredMenuItems: MenuItem[] = [];
  restaurants: Restaurant[] = [];
  form: FormGroup;
  editingItem: MenuItem | null = null;
  selectedRestaurantId: number | null = null;
  searchTerm: string = '';
  filterCategory: string = 'all';
  filterAvailability: string = 'all';

  // Categories for menu items
  categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side Dish', 'Salad', 'Soup'];

  constructor(
    private menuItemService: MenuItemService,
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      restaurantId: [null, Validators.required],
      imageUrl: [''],
      preparationTime: [0, [Validators.min(0)]],
      isAvailable: [true]
    });
  }

  ngOnInit() {
    this.loadRestaurants();
    this.loadMenuItems();
  }

  loadRestaurants() {
    console.log('Loading restaurants for menu items...');
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        console.log('Restaurants loaded:', data);
        console.log('Total restaurants:', data.length);
        this.restaurants = data;
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
        alert('Failed to load restaurants: ' + (error.error?.message || error.message));
      }
    });
  }

  loadMenuItems() {
    this.menuItemService.getAllMenuItems().subscribe({
      next: (data) => {
        this.menuItems = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
      }
    });
  }

  loadMenuItemsByRestaurant(restaurantId: number) {
    this.selectedRestaurantId = restaurantId;
    if (restaurantId) {
      this.menuItemService.getMenuItemsByRestaurant(restaurantId).subscribe({
        next: (data) => {
          this.menuItems = data;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading menu items:', error);
        }
      });
    } else {
      this.loadMenuItems();
    }
  }

  applyFilters() {
    this.filteredMenuItems = this.menuItems.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = this.filterCategory === 'all' || item.category === this.filterCategory;
      
      const matchesAvailability = this.filterAvailability === 'all' || 
        (this.filterAvailability === 'available' && item.isAvailable) ||
        (this.filterAvailability === 'unavailable' && !item.isAvailable);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onAvailabilityChange() {
    this.applyFilters();
  }

  submit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.form.value;
    
    if (this.editingItem && this.editingItem.id) {
      // Update existing item
      this.menuItemService.updateMenuItem(this.editingItem.id, formValue).subscribe({
        next: () => {
          this.editingItem = null;
          this.form.reset({ isAvailable: true });
          this.loadMenuItems();
          alert('Menu item updated successfully!');
        },
        error: (error) => {
          console.error('Error updating menu item:', error);
          alert('Error updating menu item: ' + (error.error?.message || error.message));
        }
      });
    } else {
      // Create new item
      const request: CreateMenuItemRequest = formValue;
      this.menuItemService.createMenuItem(request).subscribe({
        next: () => {
          this.form.reset({ isAvailable: true });
          this.loadMenuItems();
          alert('Menu item created successfully!');
        },
        error: (error) => {
          console.error('Error creating menu item:', error);
          alert('Error creating menu item: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  edit(item: MenuItem) {
    this.editingItem = item;
    this.form.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      restaurantId: item.restaurantId,
      imageUrl: item.imageUrl,
      preparationTime: item.preparationTime,
      isAvailable: item.isAvailable
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this menu item?')) {
      this.menuItemService.deleteMenuItem(id).subscribe({
        next: () => {
          this.loadMenuItems();
          alert('Menu item deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting menu item:', error);
          alert('Error deleting menu item: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  toggleAvailability(item: MenuItem) {
    if (!item.id) return;
    
    this.menuItemService.toggleAvailability(item.id).subscribe({
      next: () => {
        this.loadMenuItems();
      },
      error: (error) => {
        console.error('Error toggling availability:', error);
        alert('Error toggling availability: ' + (error.error?.message || error.message));
      }
    });
  }

  cancelEdit() {
    this.editingItem = null;
    this.form.reset({ isAvailable: true });
  }

  getRestaurantName(restaurantId: number | undefined): string {
    if (!restaurantId) return 'N/A';
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Unknown';
  }
}

