import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  role?: UserRole;
  gender?: string;
  age?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  assignedRestaurantIds?: number[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
  CLIENT = 'CLIENT'
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.userApiUrl}/users`;

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/active`);
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  assignRestaurant(userId: number, restaurantId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${userId}/restaurants/${restaurantId}`, {});
  }

  unassignRestaurant(userId: number, restaurantId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${userId}/restaurants/${restaurantId}`);
  }

  getUsersByRestaurant(restaurantId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }
}
