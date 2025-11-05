import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
// Role values are strings that match backend Role.java enum: ADMIN, TEACHER, STUDENT, ASSISTANT, CLIENT
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // Matches backend Role.java enum values
  active: boolean;
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
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
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
    const userId = user.id;
    switch (role) {
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
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await this.http.post(`${this.apiUrl}/logout`, {}).toPromise();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local storage and state regardless of backend response
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

    /**
     * Register account info in localStorage for quick login
     */
    registerAccountToLocalStorage(user: User, token?: string): void {
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (token) {
        localStorage.setItem('authToken', token);
      }
      this.currentUserSubject.next(user);
    }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? roles.includes(currentUser.role) : false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.role === role : false;
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
