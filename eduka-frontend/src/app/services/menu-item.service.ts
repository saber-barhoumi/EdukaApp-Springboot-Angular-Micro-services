import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MenuItem {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  restaurant?: any;
  restaurantId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  restaurantId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  private apiUrl = `${environment.apiUrl}/menu-items`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new menu item
   */
  createMenuItem(menuItem: CreateMenuItemRequest): Observable<MenuItem> {
    const { restaurantId, ...menuItemData } = menuItem;
    return this.http.post<MenuItem>(`${this.apiUrl}?restaurantId=${restaurantId}`, menuItemData);
  }

  /**
   * Update an existing menu item
   */
  updateMenuItem(id: number, menuItem: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/${id}`, menuItem);
  }

  /**
   * Delete a menu item
   */
  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get a single menu item by ID
   */
  getMenuItem(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all menu items
   */
  getAllMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

  /**
   * Get menu items by restaurant ID
   */
  getMenuItemsByRestaurant(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }

  /**
   * Get only available menu items for a restaurant
   */
  getAvailableMenuItems(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/restaurant/${restaurantId}/available`);
  }

  /**
   * Get menu items by category
   */
  getMenuItemsByCategory(category: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Search menu items by name
   */
  searchMenuItems(name: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/search`, { params: { name } });
  }

  /**
   * Toggle menu item availability
   */
  toggleAvailability(id: number): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}/toggle-availability`, {});
  }

  /**
   * Update menu item availability status
   */
  updateAvailability(id: number, isAvailable: boolean): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}/availability`, null, { 
      params: { available: isAvailable.toString() } 
    });
  }
}
