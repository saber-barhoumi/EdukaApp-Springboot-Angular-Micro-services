import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
// Role values are strings that match backend Role.java enum: ADMIN, TEACHER, STUDENT, ASSISTANT, CLIENT
import { environment } from '../../environments/environment';

export interface User {
  id?: number;        // Spring Boot/SQL uses id
  _id?: string;       // MongoDB/Node.js uses _id
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; // Matches backend Role.java enum values
  active?: boolean;
  age?: number;
  phoneNumber?: string;
  gender?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  authenticated: boolean;
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Register a new user (simple, no Keycloak)
   */
  async registerSimple(user: Partial<User>, password: string): Promise<any> {
    // Ensure required fields for backend: username, email, password, role
    // Backend expects role: 'user' or 'admin' (lowercase). Map frontend roles to backend roles.
    let role = 'user'; // Default to 'user'
    if (user.role === 'ADMIN') {
      role = 'admin';
    }
    // All other roles (CLIENT, ASSISTANT, TEACHER, STUDENT) map to 'user'
    
    const registrationData = {
      username: user.username || '',
      email: user.email || '',
      role,
      password
    };
    try {
      const response = await this.http.post(`${this.apiUrl}/register`, registrationData).toPromise();
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  /**
   * Save a new account to localStorage (multiple accounts supported)
   */
  saveAccount(user: User, token?: string): void {
    let accounts: any[] = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    // Remove if already exists (by email or username)
    accounts = accounts.filter(acc => acc.email !== user.email && acc.username !== user.username);
    accounts.push({ user, token });
    localStorage.setItem('savedAccounts', JSON.stringify(accounts));
  }

  /**
   * Get all saved accounts from localStorage
   */
  getSavedAccounts(): Array<{ user: User, token?: string }> {
    return JSON.parse(localStorage.getItem('savedAccounts') || '[]');
  }

  /**
   * Remove a saved account from localStorage
   */
  removeSavedAccount(emailOrUsername: string): void {
    let accounts: any[] = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    accounts = accounts.filter(acc => acc.user.email !== emailOrUsername && acc.user.username !== emailOrUsername);
    localStorage.setItem('savedAccounts', JSON.stringify(accounts));
  }
  private apiUrl = environment.services.userManagement + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    console.log('=== AuthService Constructor ===');
    console.log('Stored user from localStorage:', storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.currentUserSubject.next(parsedUser);
      console.log('User loaded into BehaviorSubject:', parsedUser);
    } else {
      console.log('No stored user found');
    }
  }

  /**
   * Authenticate user with backend database
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    try {
      // Patch: Send username and password as required by backend
      const loginRequest = {
        username: email, // Use email as username for now
        password
      };
      const response = await this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).toPromise();
      if (response && response.authenticated && response.user) {
        this.registerAccountToLocalStorage(response.user, response.token);
        if (rememberMe) {
          this.saveAccount(response.user, response.token);
        }
        this.navigateByRole(response.user);
      } else {
        // Handle backend response with error message
        const errorMessage = response?.message || 'Invalid username or password';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle different types of errors
      if (error.status === 401) {
        throw new Error('Invalid username or password. Please check your credentials.');
      } else if (error.status === 0) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else if (error.error && error.error.message) {
        throw new Error(error.error.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  }

  /**
   * Navigate based on user role and ID
   */
  private navigateByRole(user: User): void {
    const role = user.role;
    const userId = user._id || user.id; // Support both MongoDB _id and SQL id
    
    // Normalize role to uppercase for comparison
    const normalizedRole = role?.toUpperCase();
    
    switch (normalizedRole) {
      case 'ADMIN':
        this.router.navigate(['/admin', userId]);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher', userId]);
        break;
      case 'STUDENT':
        this.router.navigate(['/student', userId]);
        break;
      case 'ASSISTANT':
        this.router.navigate(['/assistante-chat']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client', userId]);
        break;
      case 'USER':
        // Default user role - navigate to home page
        this.router.navigate(['/']);
        break;
      default:
        console.warn('Unknown role:', role, '- navigating to home');
        this.router.navigate(['/']);
        break;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear local storage and state
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    
    // Navigate to login page
    this.router.navigate(['/login']);
    
    console.log('User logged out successfully');
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    console.log('getCurrentUser() called, returning:', user);
    return user;
  }

  /**
   * Get user ID (supports both MongoDB _id and SQL id)
   */
  getUserId(): string | number | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    // MongoDB uses _id (string), SQL uses id (number)
    return user._id || user.id || null;
  }

    /**
     * Register account info in localStorage for quick login
     */
    registerAccountToLocalStorage(user: User, token?: string): void {
      console.log('=== registerAccountToLocalStorage ===');
      console.log('Saving user:', user);
      console.log('Token:', token);
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (token) {
        localStorage.setItem('authToken', token);
      }
      this.currentUserSubject.next(user);
      
      console.log('User saved to localStorage and BehaviorSubject');
      console.log('BehaviorSubject value:', this.currentUserSubject.value);
    }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if user has any of the specified roles (case-insensitive)
   */
  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.role) return false;
    
    // Normalize both user role and required roles to uppercase for comparison
    const userRole = currentUser.role.toUpperCase();
    const normalizedRoles = roles.map(r => r.toUpperCase());
    
    return normalizedRoles.includes(userRole);
  }

  /**
   * Check if user has specific role (case-insensitive)
   */
  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.role) return false;
    
    // Normalize both roles to uppercase for comparison
    return currentUser.role.toUpperCase() === role.toUpperCase();
  }

  /**
   * Get user profile information
   */
  async getCurrentUserProfile(): Promise<User | null> {
    try {
      const response = await this.http.get<User>(`${this.apiUrl}/current-user`).toPromise();
      return response || null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
