import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
  id?: number;
  userId: number;
  restaurant?: any;
  items?: MenuItem[];
  menuItemIds?: number[];
  orderDate?: Date;
  totalAmount?: number;
  status?: OrderStatus;
  notes?: string;
  deliveryAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

export interface MenuItem {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CreateOrderRequest {
  userId: number | string;  // Support both MongoDB string and SQL number
  restaurantId: number;
  menuItemIds: number[];
  notes?: string;
  deliveryAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, null, { params: { status } });
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrderWithItems(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}/details`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrdersByRestaurant(restaurantId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  getOrdersByUserAndStatus(userId: number, status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}/status/${status}`);
  }

  getOrdersByRestaurantAndStatus(restaurantId: number, status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/restaurant/${restaurantId}/status/${status}`);
  }

  getRestaurantRevenue(restaurantId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/restaurant/${restaurantId}/revenue`);
  }

  addItemToOrder(orderId: number, menuItemId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/items/${menuItemId}`, {});
  }

  removeItemFromOrder(orderId: number, menuItemId: number): Observable<Order> {
    return this.http.delete<Order>(`${this.apiUrl}/${orderId}/items/${menuItemId}`);
  }

  // Menu Items methods
  getAvailableMenuItems(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${environment.apiUrl}/menu-items/restaurant/${restaurantId}/available`);
  }

  getAllMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${environment.apiUrl}/menu-items`);
  }

  getMenuItemsByRestaurant(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${environment.apiUrl}/menu-items/restaurant/${restaurantId}`);
  }
}
