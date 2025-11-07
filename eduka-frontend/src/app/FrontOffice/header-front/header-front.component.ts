import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
// USING DYNAMIC AUTH WITH REAL DATABASE
import { AuthService, User } from '../../services/auth-dynamic.service';
import { NotificationCenterComponent } from '../notification-center/notification-center.component';
// Role values match backend Role.java enum: ADMIN, TEACHER, STUDENT, ASSISTANT, CLIENT
// import { AuthService } from '../../auth/auth.service';
// import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-header-front',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationCenterComponent],
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
    });
  }

  navigateToLogin(): void {
    // Navigate to custom login page instead of Keycloak redirect
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    // Navigate to register page
    this.router.navigate(['/register']);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  }
  // Role constants available as string literals
}