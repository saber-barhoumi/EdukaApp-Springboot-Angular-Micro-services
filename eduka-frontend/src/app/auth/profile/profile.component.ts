import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="userProfile">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            <div class="avatar-placeholder">
              {{ userProfile.firstName?.charAt(0) || userProfile.username?.charAt(0) || 'U' }}
            </div>
          </div>
          <h2>{{ userProfile.username }}</h2>
          <p>{{ userProfile.email }}</p>
        </div>
        
        <div class="profile-details">
          <div class="detail-item">
            <label>First Name:</label>
            <span>{{ userProfile.firstName || 'Not provided' }}</span>
          </div>
          <div class="detail-item">
            <label>Last Name:</label>
            <span>{{ userProfile.lastName || 'Not provided' }}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>{{ userProfile.email }}</span>
          </div>
          <div class="detail-item">
            <label>Email Verified:</label>
            <span>{{ userProfile.emailVerified ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        
        <div class="profile-actions">
          <button (click)="logout()" class="btn btn-danger">
            Sign Out
          </button>
        </div>
      </div>
    </div>
    
    <div class="loading" *ngIf="!userProfile">
      <p>Loading profile...</p>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      padding: 2rem;
    }
    
    .profile-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      padding: 2rem;
      max-width: 500px;
      width: 100%;
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1rem;
      border: 3px solid #667eea;
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2.5rem;
      font-weight: bold;
    }
    
    h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .profile-details {
      margin-bottom: 2rem;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .detail-item:last-child {
      border-bottom: none;
    }
    
    .detail-item label {
      font-weight: 600;
      color: #555;
    }
    
    .detail-item span {
      color: #333;
    }
    
    .profile-actions {
      text-align: center;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    
    .btn-danger:hover {
      background: #c82333;
    }
    
    .loading {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  userProfile: KeycloakProfile | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(profile => {
      this.userProfile = profile;
    });
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
} 