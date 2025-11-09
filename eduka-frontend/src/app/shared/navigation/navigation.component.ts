import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth-dynamic.service';
// Using string literals that match backend Role.java enum
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Eduka App</a>
        
        <div class="navbar-nav ms-auto" *ngIf="currentUser; else loginLink">
          <span class="navbar-text me-3">
            Welcome, {{ currentUser.username }} ({{ getRoleDisplay(currentUser.role) }})
          </span>
          
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Dashboard
            </a>
            <ul class="dropdown-menu">
              <li *ngIf="hasRole(['ADMIN'])">
                <a class="dropdown-item" (click)="navigateToRole('admin')">Admin Panel</a>
              </li>
              <li *ngIf="hasRole(['TEACHER', 'ASSISTANT'])">
                <a class="dropdown-item" (click)="navigateToRole('teacher')">Teacher Dashboard</a>
              </li>
              <li *ngIf="hasRole(['STUDENT'])">
                <a class="dropdown-item" (click)="navigateToRole('student')">Student Dashboard</a>
              </li>
              <li *ngIf="hasRole(['CLIENT'])">
                <a class="dropdown-item" (click)="navigateToRole('client')">Client Portal</a>
              </li>
            </ul>
          </div>
          
          <button class="btn btn-outline-light ms-2" (click)="logout()">
            Logout
          </button>
        </div>
        
        <ng-template #loginLink>
          <div class="navbar-nav ms-auto">
            <a class="nav-link" (click)="goToLogin()">Login</a>
          </div>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
    }
    .dropdown-item {
      cursor: pointer;
    }
    .dropdown-item:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class NavigationComponent implements OnInit {
  currentUser: User | null = null;
  // Role constants moved to string literals // Make Role enum available in template

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  getRoleDisplay(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'TEACHER': return 'Teacher';
      case 'STUDENT': return 'Student';
      case 'ASSISTANT': return 'Assistant';
      case 'CLIENT': return 'Client';
      default: return 'User';
    }
  }

  navigateToRole(rolePath: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.router.navigate([`/${rolePath}`, currentUser.id]);
    } else {
      this.router.navigate([`/${rolePath}`]);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
