import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
// USING DYNAMIC AUTH WITH REAL DATABASE
import { AuthService, User } from '../../services/auth-dynamic.service';
// import { AuthService, User } from '../../services/auth-simple.service';
// import { KeycloakProfile } from 'keycloak-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Clear any cached user data to prevent routing issues
    this.clearCachedUserData();
    
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
    });
  }

  private clearCachedUserData(): void {
    // Clear localStorage and sessionStorage to prevent cached user data issues
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password, rememberMe } = this.loginForm.value;
      await this.authService.login(email, password, rememberMe);
      // Navigation is handled automatically in the auth service based on user role
      console.log('Login successful, navigation handled by auth service');
    } catch (error: any) {
      console.error('Login failed:', error);
      this.errorMessage = error.message || 'Invalid email or password. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
