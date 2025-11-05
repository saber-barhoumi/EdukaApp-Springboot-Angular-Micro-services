import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Restaurant {
  id?: number;
  name: string;
  address: string;
  type: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  openingHours?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  assignedUserIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/restaurants`;

  constructor(private http: HttpClient) { }

  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.apiUrl, restaurant);
  }

  updateRestaurant(id: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.apiUrl}/${id}`, restaurant);
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`);
  }

  getRestaurantWithMenu(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}/menu`);
  }

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl);
  }

  getActiveRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/active`);
  }

  getRestaurantsByType(type: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/type/${type}`);
  }

  searchRestaurants(name: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/search`, { params: { name } });
  }

  assignUser(restaurantId: number, userId: number): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.apiUrl}/${restaurantId}/users/${userId}`, {});
  }

  unassignUser(restaurantId: number, userId: number): Observable<Restaurant> {
    return this.http.delete<Restaurant>(`${this.apiUrl}/${restaurantId}/users/${userId}`);
  }

  getRestaurantsByUser(userId: number): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/user/${userId}`);
  }
}
