import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER', 
  STUDENT = 'STUDENT',
  ASSISTANT = 'ASSISTANT',
  CLIENT = 'CLIENT'
}

export interface User {
  id?: number;
  username: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Simulate login with role-based navigation
   */
  async login(username: string, password: string): Promise<void> {
    try {
      // TODO: Replace with actual backend authentication
      // For now, simulate login based on username
      const user = this.simulateLogin(username, password);
      
      if (user) {
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        // Navigate based on role
        this.navigateByRole(user);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Simulate user authentication (replace with backend call)
   */
  private simulateLogin(username: string, password: string): User | null {
    console.log('Login attempt:', { username, passwordLength: password.length });
    
    // Simulate different users with different roles
    const mockUsers: User[] = [
      // Test accounts for development
      {
        id: 1,
        username: 'admin@eduka.com',
        email: 'admin@eduka.com',
        role: Role.ADMIN,
        firstName: 'Admin',
        lastName: 'User'
      },
      {
        id: 2,
        username: 'teacher@eduka.com',
        email: 'teacher@eduka.com',
        role: Role.TEACHER,
        firstName: 'Teacher',
        lastName: 'User'
      },
      {
        id: 3,
        username: 'student@eduka.com',
        email: 'student@eduka.com',
        role: Role.STUDENT,
        firstName: 'Student',
        lastName: 'User'
      },
      {
        id: 4,
        username: 'assistant@eduka.com',
        email: 'assistant@eduka.com',
        role: Role.ASSISTANT,
        firstName: 'Assistant',
        lastName: 'User'
      },
      {
        id: 5,
        username: 'client@eduka.com',
        email: 'client@eduka.com',
        role: Role.CLIENT,
        firstName: 'Client',
        lastName: 'User'
      },
      // Real users from database
      {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: Role.CLIENT,
        firstName: 'Test',
        lastName: 'User'
      },
      {
        id: 2,
        username: 'saber',
        email: 'saber@gmail.com',
        role: Role.STUDENT,
        firstName: 'Saber',
        lastName: 'Barhoumi'
      },
      {
        id: 3,
        username: 'Saber Barhoumi',
        email: 'sabersalem@gmail.com',
        role: Role.CLIENT,
        firstName: 'testuser',
        lastName: 'salem'
      },
      {
        id: 4,
        username: 'sabeur',
        email: 'sabeur@gmail.com',
        role: Role.ASSISTANT,
        firstName: 'sabeur',
        lastName: 'sabeur'
      }
    ];

    // Simple authentication - check username and password
    const user = mockUsers.find(u => u.username === username || u.email === username);
    console.log('Found user:', user);
    
    // For demo purposes, accept any password. In real app, verify password
    if (user && password.length > 0) {
      console.log('Login successful for user:', user.username);
      return user;
    }
    
    console.log('Login failed - user not found or empty password');
    return null;
  }

  /**
   * Navigate based on user role and ID
   */
  private navigateByRole(user: User): void {
    const role = user.role;
    const userId = user.id;
    
    // Navigate based on role and user ID
    switch (role) {
      case Role.ADMIN:
        this.router.navigate(['/admin', userId]);
        break;
      case Role.TEACHER:
        this.router.navigate(['/teacher', userId]);
        break;
      case Role.STUDENT:
        this.router.navigate(['/student', userId]);
        break;
      case Role.ASSISTANT:
        this.router.navigate(['/assistant', userId]);
        break;
      case Role.CLIENT:
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
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: Role[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Get available test accounts for development
   */
  getTestAccounts(): User[] {
    return [
      // Test accounts for development
      { id: 1, username: 'admin@eduka.com', email: 'admin@eduka.com', role: Role.ADMIN, firstName: 'Admin', lastName: 'User' },
      { id: 2, username: 'teacher@eduka.com', email: 'teacher@eduka.com', role: Role.TEACHER, firstName: 'Teacher', lastName: 'User' },
      { id: 3, username: 'student@eduka.com', email: 'student@eduka.com', role: Role.STUDENT, firstName: 'Student', lastName: 'User' },
      { id: 4, username: 'assistant@eduka.com', email: 'assistant@eduka.com', role: Role.ASSISTANT, firstName: 'Assistant', lastName: 'User' },
      { id: 5, username: 'client@eduka.com', email: 'client@eduka.com', role: Role.CLIENT, firstName: 'Client', lastName: 'User' },
      // Real users from database
      { id: 1, username: 'testuser', email: 'test@example.com', role: Role.CLIENT, firstName: 'Test', lastName: 'User' },
      { id: 2, username: 'saber', email: 'saber@gmail.com', role: Role.STUDENT, firstName: 'Saber', lastName: 'Barhoumi' },
      { id: 3, username: 'Saber Barhoumi', email: 'sabersalem@gmail.com', role: Role.CLIENT, firstName: 'testuser', lastName: 'salem' },
      { id: 4, username: 'sabeur', email: 'sabeur@gmail.com', role: Role.ASSISTANT, firstName: 'sabeur', lastName: 'sabeur' }
    ];
  }
}
