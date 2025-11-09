import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-dynamic.service';
import { HeaderFrontComponent } from '../../FrontOffice/header-front/header-front.component';
import { FooterFrontComponent } from '../../FrontOffice/footer-front/footer-front.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderFrontComponent, FooterFrontComponent],
  template: `
    <app-header-front></app-header-front>
    <main class="main">
      <div class="site-breadcrumb" style="background: url(assets/FrontOffice/img/breadcrumb/01.jpg)">
        <div class="container-fluid">
          <h2 class="breadcrumb-title">Register</h2>
          <ul class="breadcrumb-menu">
            <li><a routerLink="/">Home</a></li>
            <li class="active">Register</li>
          </ul>
        </div>
      </div>
      <div class="login-area py-120">
        <div class="container-fluid">
          <div class="col-md-6 mx-auto">
            <div class="login-form">
              <div class="login-header">
                <img src="assets/FrontOffice/img/logo/logo.png" alt="">
                <p>Create your account</p>
              </div>
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="text" formControlName="username" class="form-control" placeholder="Username" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="email" formControlName="email" class="form-control" placeholder="Email" required>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="text" formControlName="firstName" class="form-control" placeholder="First Name">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="text" formControlName="lastName" class="form-control" placeholder="Last Name">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="password" formControlName="password" class="form-control" placeholder="Password" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="tel" formControlName="phoneNumber" class="form-control" placeholder="Phone Number">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <input type="number" formControlName="age" class="form-control" placeholder="Age" min="18" max="100">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <select formControlName="gender" class="form-control">
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <select formControlName="role" class="form-control">
                        <option value="CLIENT">Client</option>
                        <option value="ASSISTANT">Assistant</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="STUDENT">Student</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" class="theme-btn" [disabled]="isLoading || registerForm.invalid">
                  <i class="far fa-user-plus"></i>
                  <span *ngIf="!isLoading">Register</span>
                  <span *ngIf="isLoading">Registering...</span>
                </button>
              </form>
              <div *ngIf="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
              <div *ngIf="successMessage" class="alert alert-success mt-2">{{ successMessage }}</div>
              <div class="login-footer mt-3">
                <p>Already have an account? <a routerLink="/login" class="text-primary">Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <app-footer-front></app-footer-front>
  `,
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent {
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      age: [''],
      gender: [''],
      role: ['CLIENT']
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    const formData = this.registerForm.value;
    try {
      await this.authService.registerSimple({
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        age: formData.age,
        role: formData.role,
        gender: formData.gender
      }, formData.password);
      this.successMessage = 'Registration successful! You can now log in.';
      this.registerForm.reset();
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle specific error messages from backend
      if (error?.error && typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error?.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
